import { AstNode, BlockCommandCommentNode, ClangAst, FullCommentNode, isNodeKind, ParagraphCommentNode, TextCommentNode } from "./ast";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import util from 'node:util';

const output: string = `../syms.map`;
const magic: string = `//@autogen_begin`;
const program: string = `../../ttools/toolchain/clang-19`;
const flags: string= `-std=c++23 --driver-mode=g++ -ffreestanding -fno-builtin -nostdlib -nobuiltininc -Wno-switch -Werror -Wextra -Wno-unused-parameter -Wno-missing-field-initializers -Wno-missing-exception-spec -Wno-gcc-compat -Wno-invalid-offsetof -Wno-invalid-source-encoding -Wno-deprecated-enum-enum-conversion -Wshadow -ferror-limit=1 -mregnames -Dcafe -D_LIBCPP_HAS_NO_THREADS -D_LIBCPP_HAS_NO_LOCALIZATION -DDISABLE_PS -DNW_RELEASE -DIMGUI_USER_CONFIG="imgui/imgui_config.h" -O2 -mcpu=750 -fno-sized-deallocation -funsigned-char -mhard-float -mno-altivec -fno-fast-math -fno-new-infallible -fshort-wchar -fno-strict-aliasing -I../include -I../libs/headers -I../libs/sead/engine/library/include -I../libs/sead/engine/library/modules/include -I../libs/sead/packages/agl/include -I../libs/sead/packages/nw_ptcl/library/include -I../libs/Sys/include -I../libs/G3d/include -I../libs/Snd/include -I../libs/Lyt/include -I../libs/Eft/include -I../libs/FFL/include -I../libs -I../../ttools/toolchain/RedStandard-main/cxx -I../../ttools/toolchain/RedStandard-main/c -I../../ttools/toolchain/RedStandard-main/lib -I../.tachyon/packages/Telkin/include -I../.tachyon/packages/Telkin/libs/DynamicLibs/dynamic_libs/include -I../.tachyon/packages/Telkin/libs/DynamicLibs/cafe_sdk/include -I../.tachyon/packages/Telkin/libs/semverc -DMOD_VERSION="2.0.0" -D__EMULATOR__ -D__TITLEID__=1407375153044736`;
const headersDir: string = `../libs/headers`;

//#region hacks

const originalLog = console.log;

class Hexbigint {
    constructor(private readonly value: bigint) { }

    [util.inspect.custom]() {
        return `0x${this.value.toString(16).toUpperCase()}`;
    }
}

function hexify(value: unknown): unknown {
    if (typeof value === "bigint") {
        return new Hexbigint(value);
    }

    if (Array.isArray(value)) {
        return value.map(hexify);
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, hexify(v)])
        );
    }

    return value;
}

console.log = (...args: unknown[]) => {
    originalLog(...args.map(hexify));
};

// @ts-expect-error
BigInt.prototype.toJSON = function() { return "0x" + this.toString("16").toUpperCase(); }
//#endregion

//#region boilerplate

function getHeaders(dir: string): string[] {
    // return all files that end with .h in dir (recursive)
    const out: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...getHeaders(full));
        } else if (entry.isFile() && entry.name.endsWith(".h")) {
            out.push(full);
        }
    }
    return out;
}

function shellQuote(s: string): string {
    return `'${s.replace(/'/g, `'\\''`)}'`;
}

function clang(bin: string, inFile: string, baseArgs: string, extraArgs: string): string {
    const command = `${shellQuote(bin)} ${baseArgs} ${extraArgs} -x c++-header -fsyntax-only -fparse-all-comments ${shellQuote(inFile)}`;
    //console.debug(command);
    const output = execSync(command, { stdio: ["ignore", "pipe", "inherit"], maxBuffer: 1024 * 1024 * 1024, encoding: "utf8" });
    return output;
}
//#endregion

function hasLinkage(
    node: AstNode,
): node is AstNode & { mangledName: string } {
    return "mangledName" in node && typeof node.mangledName === "string";
}

interface VisitorState {
    mangled: string | null,
    namespace: string | undefined,
    className: string | undefined,
    declName: string | undefined,
    isCtor: boolean,
}

function isComment(node: AstNode) {
    return isNodeKind(node, "TextComment") || isNodeKind(node, "BlockCommandComment");
}

function getCommentText(node: TextCommentNode | BlockCommandCommentNode): string {
    let text = "";
    if (node.kind == "TextComment") {
        text = node.text ?? "";
    } else if (node.kind == "BlockCommandComment") {
        if (node.args) {
            text = node.args.toString();
        }
    }
    return text;
}

function getParagraphLines(para: ParagraphCommentNode): string[] {
    const lines: string[] = [];
    let afterInline = false;

    for (const it of para.inner ?? []) { // clang omits `inner` on empty nodes
        if (isNodeKind(it, "TextComment")) {
            if (afterInline) {
                lines[lines.length - 1] += it.text ?? ""; // rest of a line that had an inline command in it
            } else {
                lines.push(it.text ?? "");
            }
            afterInline = false;
        } else if (isNodeKind(it, "InlineCommandComment")) {
            if (lines.length === 0) {
                lines.push("");
            }
            lines[lines.length - 1] += it.name === "c" ? (it.args ?? []).join(" ") : "\u0000";
            afterInline = true;
        }
    }

    return lines;
}

function getCommentLines(comment: FullCommentNode): string[] {
    const lines: string[] = [];

    for (const child of comment.inner ?? []) {
        if (isNodeKind(child, "ParagraphComment")) {
            lines.push(...getParagraphLines(child));
        } else if (isNodeKind(child, "BlockCommandComment") && child.name === "par") {
            if (child.args) {
                lines.push(child.args.join(" "));
            }
            const para = (child.inner ?? []).find((n): n is ParagraphCommentNode => n.kind === "ParagraphComment");
            const first = para ? getParagraphLines(para)[0] : undefined;
            if (first !== undefined) {
                lines.push(first);
            }
        }
    }

    return lines.filter(line => !isBlacklistedCommentText(line) && !line.includes("guard variable"));
}

const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const whitespaceFlexible = (s: string): string => s.trim().split(/[ \t]+/).map(escapeRegex).join("[ \\t]+");

const normalizePrefixes = (allowedPrefixes: readonly string[]): string[] =>
    allowedPrefixes.map(whitespaceFlexible).filter(p => p.length > 0);

function buildAddressLineRegex(prefixes: readonly string[]): RegExp {
    const value = "Address[ \\t]*:[ \\t]*(0x[0-9a-fA-F]+|Deleted)[ \\t]*$";

    // No prefixes allowed:                  `Address: ...`
    // Prefix required (+ optional suffix):  `<prefix><suffix> Address: ...`
    const lead = prefixes.length === 0 ? "" : `(?:${prefixes.join("|")})\\S*[ \\t]+`;

    return new RegExp("^[ \\t]*" + lead + value);
}

function buildSuspectRegex(prefixes: readonly string[]): RegExp {
    return prefixes.length === 0
        ? /\bAddress\b/
        : new RegExp(`^[ \\t]*(?:${prefixes.join("|")}).*\\bAddress\\b`);
}

function parseAddressLines(
    lines: readonly string[],
    mangled: string,
    allowedPrefixes: readonly string[] = [],
    ignoredPrefixes: readonly string[] = [],
): bigint | null {
    const prefixes = normalizePrefixes(allowedPrefixes);
    const lineRegex = buildAddressLineRegex(prefixes);
    const suspectRegex = buildSuspectRegex(prefixes);

    const ignored = normalizePrefixes(ignoredPrefixes);
    const ignoreRegex = ignored.length > 0 ? new RegExp(`^[ \\t]*(?:${ignored.join("|")})`) : null;

    const suspicious: string[] = [];

    for (const line of lines) {
        const match = line.match(lineRegex);
        if (match) {
            return match[1] === "Deleted" ? -1n : BigInt(match[1]);
        }

        if (ignoreRegex?.test(line)) {
            continue;
        }

        if (suspectRegex.test(line)) {
            suspicious.push(line.trim());
        }
    }

    if (suspicious.length > 0) {
        console.warn(`WARNING: Address comment failed to parse on decl: ${mangled}. "${suspicious.join(" | ")}"`);
    }

    return null;
}

function parseAddress(
    node: TextCommentNode | BlockCommandCommentNode,
    mangled: string,
    allowedPrefixes: readonly string[] = [],
): bigint | null {
    return parseAddressLines(getCommentText(node).split(/\r?\n/), mangled, allowedPrefixes);
}

function isStateDecl(node: AstNode): boolean {
    if (!isNodeKind(node, "VarDecl")) {
        return false;
    }

    if (!node.name.startsWith("StateID_")) {
        return false;
    }

    if (node.storageClass != "static") {
        return false;
    }

    return true;
}

function isStateInit(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }
    
    if (!node.name.startsWith("initializeState_")) {
        return false;
    }

    return true;
}

function isStateExec(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }
    
    if (!node.name.startsWith("executeState_")) {
        return false;
    }

    return true;
}

function isStateFinal(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }
    
    if (!node.name.startsWith("finalizeState_")) {
        return false;
    }

    return true;
}

function isStaticInstance(node: AstNode): boolean {
    if (!isNodeKind(node, "VarDecl")) {
        return false;
    }

    if (node.name !== "sInstance") {
        return false;
    }

    if (node.storageClass !== "static") {
        return false;
    }

    return true;
}

interface SymbolData {
    addr: bigint,
    namespace: string | undefined,
    className: string | undefined
}

interface StateAddrs {
    id: bigint | null,
    init: bigint | null,
    exec: bigint | null,
    final: bigint | null
}


function ctorC2Variant(mangled: string): string | null {
    if (!mangled.startsWith("_Z") || mangled[2] !== "N") {
        return null;
    }

    let pos = 3;
    while (
        mangled[pos] === "K" || mangled[pos] === "V" ||
        mangled[pos] === "r" || mangled[pos] === "R" || mangled[pos] === "O"
    ) {
        pos++;
    }

    const n = mangled.length;

    const skipTemplateArgs = (): boolean => {
        let depth = 0;
        while (pos < n) {
            const ch = mangled[pos];
            if (ch === "I") {
                depth++;
            } else if (ch === "E") {
                depth--;
                if (depth === 0) {
                    pos++;
                    return true;
                }
            }
            pos++;
        }
        return false;
    };

    while (pos < n) {
        const c = mangled[pos];

        if (c === "C" && (mangled[pos + 1] === "1" || mangled[pos + 1] === "2")) {
            if (mangled[pos + 2] !== "E") {
                return null;
            }
            const other = mangled[pos + 1] === "1" ? "2" : "1";
            return mangled.slice(0, pos + 1) + other + mangled.slice(pos + 2);
        }

        if (c >= "0" && c <= "9") {
            let j = pos;
            while (j < n && mangled[j] >= "0" && mangled[j] <= "9") {
                j++;
            }
            const len = parseInt(mangled.slice(pos, j), 10);
            if (!Number.isSafeInteger(len)) {
                return null;
            }
            pos = j + len;
            if (pos > n) {
                return null;
            }
            if (mangled[pos] === "I") {
                if (!skipTemplateArgs()) {
                    return null;
                }
            }
            continue;
        }

        if (c === "I") {
            if (!skipTemplateArgs()) {
                return null;
            }
            continue;
        }

        if (c === "S") {
            const nx = mangled[pos + 1];
            if (nx === "t" || nx === "a" || nx === "b" || nx === "s" || nx === "i" || nx === "o" || nx === "d") {
                pos += 2;
                continue;
            }
            pos++;
            while (pos < n && mangled[pos] !== "_") {
                pos++;
            }
            if (mangled[pos] !== "_") {
                return null;
            }
            pos++;
            continue;
        }

        return null;
    }

    return null;
}

function addSymbol(
    symbols: Map<string, SymbolData>,
    mangled: string,
    data: SymbolData,
    isCtor: boolean,
): void {
    symbols.set(mangled, data);
    if (isCtor) {
        const alias = ctorC2Variant(mangled);
        if (alias !== null && alias !== mangled) {
            symbols.set(alias, data);
        }
    }
}

function extractStateAddrs(node: AstNode, out: StateAddrs) {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text)) {
        const id = parseAddress(node, node.text, ["StateID_"]);
        if (id !== null) out.id = id;
        const init = parseAddress(node, node.text, ["initializeState_"]);
        if (init !== null) out.init = init;
        const exec = parseAddress(node, node.text, ["executeState_"]);
        if (exec !== null) out.exec = exec;
        const final = parseAddress(node, node.text, ["finalizeState_"]);
        if (final !== null) out.final = final;
    }
    
    if (node.inner) {
        for (const it of node.inner) {
            extractStateAddrs(it, out);
        }
    }
}

function visitState(node: AstNode, state: VisitorState, symbols: Map<string, SymbolData>): boolean {
    if (isStateDecl(node)) {
        const addrs: StateAddrs = {
            id: null,
            init: null,
            exec: null,
            final: null
        }
        
        extractStateAddrs(node, addrs);
        
        if (addrs.id != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addrs.id,
                    namespace: state.namespace,
                    className: state.className
                }
            );
        }
        
        return true;
    } else if (isStateInit(node)) {
        const addrs: StateAddrs = {
            id: null,
            init: null,
            exec: null,
            final: null
        }
        
        extractStateAddrs(node, addrs);
        
        if (addrs.init != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addrs.init,
                    namespace: state.namespace,
                    className: state.className
                }
            )
        }
        
        return true;
    } else if (isStateExec(node)) {
        const addrs: StateAddrs = {
            id: null,
            init: null,
            exec: null,
            final: null
        }
        
        extractStateAddrs(node, addrs);
        
        if (addrs.exec != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addrs.exec,
                    namespace: state.namespace,
                    className: state.className
                }
            )
        }
        
        return true;
    } else if (isStateFinal(node)) {
        const addrs: StateAddrs = {
            id: null,
            init: null,
            exec: null,
            final: null
        }
        
        extractStateAddrs(node, addrs);
        
        if (addrs.final != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addrs.final,
                    namespace: state.namespace,
                    className: state.className
                }
            )
        }
        
        return true;
    }

    return false;
}

const claimedPrefixes: readonly string[] = [
    "vtable", "vtbl",
    "StateID_", "initializeState_", "executeState_", "finalizeState_",
    "getRuntimeTypeInfoStatic()::typeInfo",
    "sInstance", "createInstance()", "deleteInstance()", "setInstance_()",
];

const hasAddressValue = (text: string): boolean => /Address[ \t]*:[ \t]*(?:0x|Deleted)/.test(text);

const isBlacklistedCommentText = (text: string): boolean => text.includes("SingletonDisposer_::");

function blacklist(node: AstNode): boolean {
    if (isNodeKind(node, "CXXMethodDecl") && node.name == "getRuntimeTypeInfoStatic") {
        return true;
    }
    if (isNodeKind(node, "CXXMethodDecl") && node.name == "checkDerivedRuntimeTypeInfo") {
        return true;
    }
    if (isNodeKind(node, "CXXMethodDecl") && node.name == "getRuntimeTypeInfo") {
        return true;
    }
    if (isComment(node)) {
        if (isBlacklistedCommentText(getCommentText(node))) {
            return true;
        }
    }
    
    return false;
}

function isRTTIDecl(node: AstNode): boolean {
    if (!isNodeKind(node, "VarDecl")) {
        return false;
    }

    if (node.name != "sTypeInfo") {
        return false;
    }
    
    if (node.storageClass != "static") {
        return false;
    }
    
    return true;
}

function extractRTTIAddr(node: AstNode): bigint | null {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text) && node.text.includes("typeInfo") && !node.text.includes("guard variable")) {
        return parseAddress(node, node.text, ["getRuntimeTypeInfoStatic()::typeInfo"]);
    }

    if (node.inner) {
        for (const it of node.inner) {
            const addr = extractRTTIAddr(it);
            if (addr != null) {
                return addr;
            }
        }
    }

    return null;
}

function visitRTTI(node: AstNode, state: VisitorState, symbols: Map<string, SymbolData>): boolean {
    if (isRTTIDecl(node)) {
        const addr = extractRTTIAddr(node);
        if (addr != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                }
            );
            return true;
        }
    }
    
    return false;
}

function extractStaticInstanceAddr(node: AstNode): bigint | null {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text) && node.text.includes("sInstance")) {
        return parseAddress(node, node.text, ["sInstance"]);
    }

    if (node.inner) {
        for (const it of node.inner) {
            const addr = extractStaticInstanceAddr(it);
            if (addr !== null) {
                return addr;
            }
        }
    }

    return null;
}

function isCreateInstance(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }

    if (node.name !== "createInstance") {
        return false;
    }

    if (node.storageClass !== "static") {
        return false;
    }

    return true;
}

function isDeleteInstance(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }

    if (node.name !== "deleteInstance") {
        return false;
    }

    if (node.storageClass !== "static") {
        return false;
    }

    return true;
}

function extractCreateInstanceAddr(node: AstNode): bigint | null {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text) && node.text.includes("createInstance()")) {
        return parseAddress(node, node.text, ["createInstance()"]);
    }

    if (node.inner) {
        for (const it of node.inner) {
            const addr = extractCreateInstanceAddr(it);
            if (addr !== null) {
                return addr;
            }
        }
    }
    
    return null;
}

function extractDeleteInstanceAddr(node: AstNode): bigint | null {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text) && node.text.includes("deleteInstance()")) {
        return parseAddress(node, node.text, ["deleteInstance()"]);
    }

    if (node.inner) {
        for (const it of node.inner) {
            const addr = extractDeleteInstanceAddr(it);
            if (addr !== null) {
                return addr;
            }
        }
    }
    
    return null;
}

function isSetInstance(node: AstNode): boolean {
    if (!isNodeKind(node, "CXXMethodDecl")) {
        return false;
    }

    if (node.name !== "setInstance_") {
        return false;
    }

    if (node.storageClass !== "static") {
        return false;
    }

    return true;
}

function extractSetInstanceAddr(node: AstNode): bigint | null {
    if (isNodeKind(node, "TextComment") && hasAddressValue(node.text) && node.text.includes("setInstance_()")) {
        return parseAddress(node, node.text, ["setInstance_()"]);
    }

    if (node.inner) {
        for (const it of node.inner) {
            const addr = extractSetInstanceAddr(it);
            if (addr !== null) {
                return addr;
            }
        }
    }
    
    return null;
}

function visitSingleton(node: AstNode, state: VisitorState, symbols: Map<string, SymbolData>): boolean {
    if (isStaticInstance(node)) {
        const addr = extractStaticInstanceAddr(node);
        if (addr != null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                }
            );
            return true;
        }
    }

    if (isCreateInstance(node)) {
        const addr = extractCreateInstanceAddr(node);
        if (addr !== null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                }
            );
            return true;
        }
    }

    if (isDeleteInstance(node)) {
        const addr = extractDeleteInstanceAddr(node);
        if (addr !== null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                }
            );
            return true;
        }
    }

    if (isSetInstance(node)) {
        const addr = extractSetInstanceAddr(node);
        if (addr !== null && state.mangled) {
            symbols.set(
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                }
            );
            return true;
        }
    }

    return false;
}

function mangleScopedName(namespace: string | undefined, className: string): string {
    const parts: string[] = [];
    if (namespace) {
        for (const s of namespace.split("::")) {
            if (s.length > 0) parts.push(`${s.length}${s}`);
        }
    }
    for (const s of className.split("::")) {
        if (s.length > 0) parts.push(`${s.length}${s}`);
    }
    if (parts.length > 1) {
        return `N${parts.join("")}E`;
    }
    return parts.join("");
}

function visitVtbl(node: AstNode, state: VisitorState, symbols: Map<string, SymbolData>): boolean {
    if (!state.className || !isNodeKind(node, "FullComment")) {
        return false;
    }

    const mangled = `_ZTV${mangleScopedName(state.namespace, state.className)}`;
    const addr = parseAddressLines(getCommentLines(node), mangled, ["vtable", "vtbl"]);
    if (addr === null) {
        return false;
    }

    symbols.set(
        mangled,
        {
            addr: addr,
            namespace: state.namespace,
            className: state.className
        }
    );

    return true;
}

let nc = 0;

function visitNode(node: AstNode, parent: VisitorState | null, symbols: Map<string, SymbolData>) {
    nc++;

    if (blacklist(node)) {
        return;
    }

    const state: VisitorState = {
        mangled: parent?.mangled ?? null,
        namespace: parent?.namespace,
        className: parent?.className,
        declName: parent?.declName,
        isCtor: parent?.isCtor ?? false,
    };

    if (!node.kind?.endsWith("Comment")) {
        state.declName = "name" in node && typeof node.name === "string" ? node.name : undefined;
    }

    if (isNodeKind(node, "NamespaceDecl") && node.name) {
        if (state.namespace) {
            state.namespace += ("::" + node.name);
        } else {
            state.namespace = node.name;
        }
    }

    if (hasLinkage(node)) {
        state.mangled = node.mangledName;
        state.isCtor = isNodeKind(node, "CXXConstructorDecl");
    }

    if (isNodeKind(node, "CXXRecordDecl") && node.name && !node.isImplicit) {
        state.className = state.className ? `${state.className}::${node.name}` : node.name;
    }

    if (visitVtbl(node, state, symbols)) {
        return;
    }

    if (visitState(node, state, symbols)) {
        return;
    }

    if (visitRTTI(node, state, symbols)) {
        return;
    }

    if (visitSingleton(node, state, symbols)) {
        return;
    }

    if (isNodeKind(node, "FullComment") && state.mangled) {
        const lines = getCommentLines(node);
        const own = state.declName ? [state.declName] : [];
        const addr = parseAddressLines(lines, state.mangled, [], [...claimedPrefixes, ...own])
            ?? (own.length > 0 ? parseAddressLines(lines, state.mangled, own) : null);
        if (addr) {
            addSymbol(
                symbols,
                state.mangled,
                {
                    addr: addr,
                    namespace: state.namespace,
                    className: state.className
                },
                state.isCtor
            );
        }
    }

    if (node.inner) {
        for (const it of node.inner) {
            visitNode(it, state, symbols);
        }
    }

    return;
}

function extractSymbols(ast: ClangAst): Map<string, SymbolData> {
    const symbols = new Map<string, SymbolData>

    for (const it of ast.inner) {
        const node: AstNode = it;
        visitNode(node, null, symbols);
    }

    return symbols;
}

interface Symbol {
    mangled: string,
    data: SymbolData
}

function sortByNamespace(a: string, b: string): number {
    const aParts = a.split("::");
    const bParts = b.split("::");

    const aNamespaced = aParts.length > 1;
    const bNamespaced = bParts.length > 1;

    if (aNamespaced !== bNamespaced) {
        return aNamespaced ? -1 : 1;
    }

    const count = Math.min(aParts.length, bParts.length);

    for (let i = 0; i < count; i++) {
        const cmp = aParts[i].localeCompare(bParts[i]);

        if (cmp !== 0) {
            return cmp;
        }
    }

    return aParts.length - bParts.length;
}

function generateSortedMap(symbols: Map<string, Symbol>): string {
    const quals = new Map<string, Symbol[]>();
 
    for (const [_, symbol] of symbols) {
        let qual = "";
        if (symbol.data.namespace) {
            qual += symbol.data.namespace + "::";
        }
        qual += symbol.data.className;
 
        let arr = quals.get(qual);
        if (!arr) {
            quals.set(qual, []);
            arr = quals.get(qual);
        }
        arr!.push(symbol);
    }
 
    const sorted = new Map(
        [...quals.entries()].sort(([a], [b]) => sortByNamespace(a, b))
    );
 
    let file = "";
    for (const [qual, vals] of sorted) {
        vals.sort((a, b) =>
            a.data.addr < b.data.addr ? -1 :
            a.data.addr > b.data.addr ? 1 :
            0
        );
        file += `// ${qual}\n`;
        for (const sym of vals) {
            file += `    ${sym.mangled} = ${sym.data.addr == -1n ? "__deleted_virtual_called" : "0x" + sym.data.addr.toString(16).toUpperCase().padStart(8, '0')};\n`;
        }
        file += '\n';
    }
 
    return file;
}

function writeSortedMap(symbols: Map<string, Symbol>, out: string) {
    const generated = generateSortedMap(symbols);
 
    let head = `${magic}\n`;
 
    if (fs.existsSync(out)) {
        const text = fs.readFileSync(out, "utf8");
        const at = text.indexOf(magic);
 
        const lineEnd = text.indexOf("\n", at);
        head = lineEnd < 0 ? text + "\n" : text.slice(0, lineEnd + 1);
    } else {
        console.error(`${out} does not exist`);
    }
 
    fs.writeFileSync(out, head + generated);
}

function main(): void {
    const bin = program;
    const dir = headersDir;
    let headers = getHeaders(dir);
    const symbols = new Map<string, Symbol>();
    let ok = 0;
    for (const header of headers) {
        const rel = path.relative(dir, header);
        console.log(`Dumping ${rel} (${symbols.size} symbols, ${nc} nodes)`);
        try {
            const raw = clang(bin, header, flags, `-Xclang -ast-dump=json`);
            const map = extractSymbols(JSON.parse(raw));
            for (const [key, value] of map) {
                symbols.set(key, { mangled: key, data: value });
            }

            ok++;
        } catch (err) {
            const status = (err as { status?: number | null }).status;
            if (typeof status === "number") {
                console.error(`ERROR: clang exited with status ${status} on ${rel}`);
            } else {
                console.error(`ERROR while processing ${rel}:`, err);
            }
            process.exit(1);
        }
    }
    console.log(`Done: ${ok} ok.`);
    
    writeSortedMap(symbols, output);
}

main();
