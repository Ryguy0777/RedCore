// TypeScript definitions for Clang 19.1.7 AST

export type ClangNodeId = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];
export interface JsonObject {
    readonly [key: string]: JsonValue;
}

export interface IncludedFrom {
    readonly file: string;
}

export interface SourceLocation {
    readonly offset?: number;
    readonly file?: string;
    readonly line?: number;
    readonly presumedLine?: number;
    readonly col?: number;
    readonly tokLen?: number;
    readonly includedFrom?: IncludedFrom;
    readonly spellingLoc?: SourceLocation;
    readonly expansionLoc?: SourceLocation;
    readonly isMacroArgExpansion?: boolean;
}

export interface SourceRange {
    readonly begin: SourceLocation;
    readonly end: SourceLocation;
}

export interface TypeInfo {
    readonly qualType: string;
    readonly desugaredQualType?: string;
    readonly typeAliasDeclId?: ClangNodeId;
}

export type AccessSpecifier = "private" | "protected" | "public";
export type CallingConvention = "cdecl";
export type CastKind = "ArrayToPointerDecay" | "BaseToDerived" | "BitCast" | "BuiltinFnToFnPtr" | "ConstructorConversion" | "Dependent" | "DerivedToBase" | "FloatingCast" | "FloatingToIntegral" | "FunctionToPointerDecay" | "IntegralCast" | "IntegralToBoolean" | "IntegralToFloating" | "IntegralToPointer" | "LValueBitCast" | "LValueToRValue" | "LValueToRValueBitCast" | "NoOp" | "NullToMemberPointer" | "NullToPointer" | "PointerToBoolean" | "PointerToIntegral" | "ToVoid" | "UncheckedDerivedToBase" | "UserDefinedConversion";
export type CommentDirection = "in";
export type CommentRenderKind = "monospaced";
export type ConstructionKind = "complete" | "non-virtual base";
export type CvQualifier = "__restrict" | "const" | "const volatile" | "volatile";
export type ExplicitlyDefaultedKind = "default" | "deleted";
export type InitializationKind = "c" | "call" | "list";
export type InitializationStyle = "call";
export type LanguageKind = "C" | "C++";
export type NonOdrUseReason = "constant" | "unevaluated";
export type OperatorOpcode = "!" | "!=" | "%" | "&" | "&&" | "&=" | "*" | "*=" | "+" | "++" | "+=" | "," | "-" | "--" | "-=" | ".*" | "/" | "/=" | "<" | "<<" | "<=" | "<=>" | "=" | "==" | ">" | ">=" | ">>" | "^" | "^=" | "|" | "|=" | "||" | "~";
export type ScopedEnumTag = "class";
export type StorageClass = "extern" | "static";
export type StorageDuration = "automatic" | "full expression";
export type TagKind = "class" | "struct" | "typename" | "union";
export type TypeTransformKind = "add_lvalue_reference" | "add_pointer" | "add_rvalue_reference" | "decay" | "make_signed" | "make_unsigned" | "remove_all_extents" | "remove_const" | "remove_cv" | "remove_cvref" | "remove_extent" | "remove_pointer" | "remove_reference_t" | "remove_volatile" | "underlying_type";
export type ValueCategory = "lvalue" | "prvalue" | "xvalue";
export type VisibilityKind = "default" | "hidden";
export type WrittenAccessSpecifier = "none" | "private" | "protected" | "public";

export interface BaseSpecifier {
    readonly access: AccessSpecifier;
    readonly type: TypeInfo;
    readonly writtenAccess: WrittenAccessSpecifier;
    readonly isPackExpansion?: boolean;
}

export interface CastPathElement {
    readonly name: string;
}

export interface CopyAssignmentDefinition {
    readonly hasConstParam?: boolean;
    readonly implicitHasConstParam?: boolean;
    readonly needsImplicit?: boolean;
    readonly needsOverloadResolution?: boolean;
    readonly nonTrivial?: boolean;
    readonly simple?: boolean;
    readonly trivial?: boolean;
    readonly userDeclared?: boolean;
}

export interface CopyConstructorDefinition extends CopyAssignmentDefinition {
    readonly defaultedIsDeleted?: boolean;
}

export interface DefaultConstructorDefinition {
    readonly defaultedIsConstexpr?: boolean;
    readonly exists?: boolean;
    readonly isConstexpr?: boolean;
    readonly needsImplicit?: boolean;
    readonly nonTrivial?: boolean;
    readonly trivial?: boolean;
    readonly userProvided?: boolean;
}

export interface MoveSpecialMemberDefinition {
    readonly exists?: boolean;
    readonly needsImplicit?: boolean;
    readonly needsOverloadResolution?: boolean;
    readonly nonTrivial?: boolean;
    readonly simple?: boolean;
    readonly trivial?: boolean;
    readonly userDeclared?: boolean;
}

export interface DestructorDefinition extends MoveSpecialMemberDefinition {
    readonly irrelevant?: boolean;
}

export interface CxxRecordDefinitionData {
    readonly canConstDefaultInit?: boolean;
    readonly canPassInRegisters?: boolean;
    readonly copyAssign?: CopyAssignmentDefinition;
    readonly copyCtor?: CopyConstructorDefinition;
    readonly defaultCtor?: DefaultConstructorDefinition;
    readonly dtor?: DestructorDefinition;
    readonly hasConstexprNonCopyMoveConstructor?: boolean;
    readonly hasMutableFields?: boolean;
    readonly hasUserDeclaredConstructor?: boolean;
    readonly hasVariantMembers?: boolean;
    readonly isAbstract?: boolean;
    readonly isAggregate?: boolean;
    readonly isEmpty?: boolean;
    readonly isGenericLambda?: boolean;
    readonly isLambda?: boolean;
    readonly isLiteral?: boolean;
    readonly isPOD?: boolean;
    readonly isPolymorphic?: boolean;
    readonly isStandardLayout?: boolean;
    readonly isTrivial?: boolean;
    readonly isTriviallyCopyable?: boolean;
    readonly moveAssign?: MoveSpecialMemberDefinition;
    readonly moveCtor?: MoveSpecialMemberDefinition;
}

export interface AstNodeBase<K extends AstNodeKind> {
    readonly kind: K;
    readonly id?: ClangNodeId;
    readonly loc?: SourceLocation;
    readonly range?: SourceRange;
    readonly inner?: readonly AstNode[];
}

export interface AbiTagAttrNode extends AstNodeBase<"AbiTagAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface AccessSpecDeclNode extends AstNodeBase<"AccessSpecDecl"> {
    readonly access: AccessSpecifier;
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface AlignedAttrNode extends AstNodeBase<"AlignedAttr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface AllocAlignAttrNode extends AstNodeBase<"AllocAlignAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface AllocSizeAttrNode extends AstNodeBase<"AllocSizeAttr"> {
    readonly id: ClangNodeId;
    readonly implicit?: boolean;
    readonly inherited?: boolean;
    readonly range: SourceRange;
}

export interface AlwaysInlineAttrNode extends AstNodeBase<"AlwaysInlineAttr"> {
    readonly id: ClangNodeId;
    readonly inherited?: boolean;
    readonly range: SourceRange;
}

export interface ArrayInitIndexExprNode extends AstNodeBase<"ArrayInitIndexExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ArrayInitLoopExprNode extends AstNodeBase<"ArrayInitLoopExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ArraySubscriptExprNode extends AstNodeBase<"ArraySubscriptExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ArrayTypeTraitExprNode extends AstNodeBase<"ArrayTypeTraitExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface AttributedStmtNode extends AstNodeBase<"AttributedStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface AvailableOnlyInDefaultEvalMethodAttrNode extends AstNodeBase<"AvailableOnlyInDefaultEvalMethodAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface BinaryOperatorNode extends AstNodeBase<"BinaryOperator"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly opcode: OperatorOpcode;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface BlockCommandCommentNode extends AstNodeBase<"BlockCommandComment"> {
    readonly args?: readonly string[];
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface BreakStmtNode extends AstNodeBase<"BreakStmt"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface BuiltinAttrNode extends AstNodeBase<"BuiltinAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly range: SourceRange;
}

export interface BuiltinBitCastExprNode extends AstNodeBase<"BuiltinBitCastExpr"> {
    readonly castKind: CastKind;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface BuiltinTemplateDeclNode extends AstNodeBase<"BuiltinTemplateDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isImplicit: boolean;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface BuiltinTypeNode extends AstNodeBase<"BuiltinType"> {
    readonly id: ClangNodeId;
    readonly type: TypeInfo;
}

export interface CStyleCastExprNode extends AstNodeBase<"CStyleCastExpr"> {
    readonly castKind: CastKind;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXX11NoReturnAttrNode extends AstNodeBase<"CXX11NoReturnAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface CXXBindTemporaryExprNode extends AstNodeBase<"CXXBindTemporaryExpr"> {
    readonly dtor: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly temp: string;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXBoolLiteralExprNode extends AstNodeBase<"CXXBoolLiteralExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: boolean;
    readonly valueCategory: ValueCategory;
}

export interface CXXConstCastExprNode extends AstNodeBase<"CXXConstCastExpr"> {
    readonly castKind: CastKind;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXConstructExprNode extends AstNodeBase<"CXXConstructExpr"> {
    readonly constructionKind: ConstructionKind;
    readonly ctorType: TypeInfo;
    readonly hadMultipleCandidates: boolean;
    readonly id: ClangNodeId;
    readonly list?: boolean;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
    readonly zeroing?: boolean;
}

export interface CXXConstructorDeclNode extends AstNodeBase<"CXXConstructorDecl"> {
    readonly constexpr?: boolean;
    readonly explicitlyDefaulted?: ExplicitlyDefaultedKind;
    readonly explicitlyDeleted?: boolean;
    readonly id: ClangNodeId;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly type: TypeInfo;
    readonly variadic?: boolean;
}

export interface CXXConversionDeclNode extends AstNodeBase<"CXXConversionDecl"> {
    readonly constexpr?: boolean;
    readonly id: ClangNodeId;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly type: TypeInfo;
}

export interface CXXCtorInitializerNode extends AstNodeBase<"CXXCtorInitializer"> {
    readonly anyInit?: AstNode;
    readonly baseInit?: TypeInfo;
    readonly inner: readonly AstNode[];
}

export interface CXXDeductionGuideDeclNode extends AstNodeBase<"CXXDeductionGuideDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
    readonly type: TypeInfo;
}

export interface CXXDefaultArgExprNode extends AstNodeBase<"CXXDefaultArgExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXDeleteExprNode extends AstNodeBase<"CXXDeleteExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isArray: boolean;
    readonly isArrayAsWritten: boolean;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXDependentScopeMemberExprNode extends AstNodeBase<"CXXDependentScopeMemberExpr"> {
    readonly explicitTemplateArgs?: readonly TemplateArgumentNode[];
    readonly hasExplicitTemplateArgs?: boolean;
    readonly hasTemplateKeyword?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isArrow: boolean;
    readonly member: string;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXDestructorDeclNode extends AstNodeBase<"CXXDestructorDecl"> {
    readonly constexpr?: boolean;
    readonly explicitlyDefaulted?: ExplicitlyDefaultedKind;
    readonly explicitlyDeleted?: boolean;
    readonly id: ClangNodeId;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly type: TypeInfo;
    readonly virtual?: boolean;
}

export interface CXXFoldExprNode extends AstNodeBase<"CXXFoldExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXForRangeStmtNode extends AstNodeBase<"CXXForRangeStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface CXXFunctionalCastExprNode extends AstNodeBase<"CXXFunctionalCastExpr"> {
    readonly castKind: CastKind;
    readonly conversionFunc?: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXMemberCallExprNode extends AstNodeBase<"CXXMemberCallExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXMethodDeclNode extends AstNodeBase<"CXXMethodDecl"> {
    readonly constexpr?: boolean;
    readonly explicitlyDefaulted?: ExplicitlyDefaultedKind;
    readonly explicitlyDeleted?: boolean;
    readonly id: ClangNodeId;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly pure?: boolean;
    readonly storageClass?: StorageClass;
    readonly type: TypeInfo;
    readonly variadic?: boolean;
    readonly virtual?: boolean;
}

export interface CXXNewExprNode extends AstNodeBase<"CXXNewExpr"> {
    readonly id: ClangNodeId;
    readonly initStyle?: InitializationStyle;
    readonly isArray?: boolean;
    readonly isGlobal?: boolean;
    readonly isPlacement?: boolean;
    readonly operatorNewDecl?: AstNode;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXNoexceptExprNode extends AstNodeBase<"CXXNoexceptExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXNullPtrLiteralExprNode extends AstNodeBase<"CXXNullPtrLiteralExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXOperatorCallExprNode extends AstNodeBase<"CXXOperatorCallExpr"> {
    readonly adl?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXPseudoDestructorExprNode extends AstNodeBase<"CXXPseudoDestructorExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXRecordDeclNode extends AstNodeBase<"CXXRecordDecl"> {
    readonly bases?: readonly BaseSpecifier[];
    readonly completeDefinition?: boolean;
    readonly definitionData?: CxxRecordDefinitionData;
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly name?: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly tagUsed?: TagKind;
}

export interface CXXReinterpretCastExprNode extends AstNodeBase<"CXXReinterpretCastExpr"> {
    readonly castKind: CastKind;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXRewrittenBinaryOperatorNode extends AstNodeBase<"CXXRewrittenBinaryOperator"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXScalarValueInitExprNode extends AstNodeBase<"CXXScalarValueInitExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXStaticCastExprNode extends AstNodeBase<"CXXStaticCastExpr"> {
    readonly castKind: CastKind;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly path?: readonly CastPathElement[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXTemporaryObjectExprNode extends AstNodeBase<"CXXTemporaryObjectExpr"> {
    readonly constructionKind: ConstructionKind;
    readonly ctorType: TypeInfo;
    readonly hadMultipleCandidates: boolean;
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
    readonly zeroing?: boolean;
}

export interface CXXThisExprNode extends AstNodeBase<"CXXThisExpr"> {
    readonly id: ClangNodeId;
    readonly implicit?: boolean;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CXXUnresolvedConstructExprNode extends AstNodeBase<"CXXUnresolvedConstructExpr"> {
    readonly id: ClangNodeId;
    readonly list?: boolean;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CallExprNode extends AstNodeBase<"CallExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CaseStmtNode extends AstNodeBase<"CaseStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface CharacterLiteralNode extends AstNodeBase<"CharacterLiteral"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: number;
    readonly valueCategory: ValueCategory;
}

export interface ClassTemplateDeclNode extends AstNodeBase<"ClassTemplateDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly range: SourceRange;
}

export interface ClassTemplatePartialSpecializationDeclNode extends AstNodeBase<"ClassTemplatePartialSpecializationDecl"> {
    readonly bases?: readonly BaseSpecifier[];
    readonly completeDefinition?: boolean;
    readonly definitionData?: CxxRecordDefinitionData;
    readonly id: ClangNodeId;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly tagUsed?: TagKind;
}

export interface ClassTemplateSpecializationDeclNode extends AstNodeBase<"ClassTemplateSpecializationDecl"> {
    readonly bases?: readonly BaseSpecifier[];
    readonly completeDefinition?: boolean;
    readonly definitionData?: CxxRecordDefinitionData;
    readonly id: ClangNodeId;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly tagUsed?: TagKind;
}

export interface CompoundAssignOperatorNode extends AstNodeBase<"CompoundAssignOperator"> {
    readonly computeLHSType: TypeInfo;
    readonly computeResultType: TypeInfo;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly opcode: OperatorOpcode;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface CompoundRequirementNode extends AstNodeBase<"CompoundRequirement"> {
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
}

export interface CompoundStmtNode extends AstNodeBase<"CompoundStmt"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface ConceptDeclNode extends AstNodeBase<"ConceptDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface ConceptSpecializationExprNode extends AstNodeBase<"ConceptSpecializationExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ConditionalOperatorNode extends AstNodeBase<"ConditionalOperator"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ConstAttrNode extends AstNodeBase<"ConstAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly range: SourceRange;
}

export interface ConstantArrayTypeNode extends AstNodeBase<"ConstantArrayType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly size: number;
    readonly type: TypeInfo;
}

export interface ConstantExprNode extends AstNodeBase<"ConstantExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: string;
    readonly valueCategory: ValueCategory;
}

export interface ContinueStmtNode extends AstNodeBase<"ContinueStmt"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface DeclRefExprNode extends AstNodeBase<"DeclRefExpr"> {
    readonly foundReferencedDecl?: AstNode;
    readonly id: ClangNodeId;
    readonly nonOdrUseReason?: NonOdrUseReason;
    readonly range: SourceRange;
    readonly referencedDecl: AstNode;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface DeclStmtNode extends AstNodeBase<"DeclStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface DecltypeTypeNode extends AstNodeBase<"DecltypeType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface DefaultStmtNode extends AstNodeBase<"DefaultStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface DependentNameTypeNode extends AstNodeBase<"DependentNameType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface DependentScopeDeclRefExprNode extends AstNodeBase<"DependentScopeDeclRefExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface DependentSizedArrayTypeNode extends AstNodeBase<"DependentSizedArrayType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface DependentTemplateSpecializationTypeNode extends AstNodeBase<"DependentTemplateSpecializationType"> {
    readonly id: ClangNodeId;
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface DeprecatedAttrNode extends AstNodeBase<"DeprecatedAttr"> {
    readonly id: ClangNodeId;
    readonly inherited?: boolean;
    readonly message?: string;
    readonly range: SourceRange;
}

export interface DoStmtNode extends AstNodeBase<"DoStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface ElaboratedTypeNode extends AstNodeBase<"ElaboratedType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly ownedTagDecl?: AstNode;
    readonly qualifier?: string;
    readonly type: TypeInfo;
}

export interface EnableIfAttrNode extends AstNodeBase<"EnableIfAttr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface EnumConstantDeclNode extends AstNodeBase<"EnumConstantDecl"> {
    readonly id: ClangNodeId;
    readonly isReferenced?: boolean;
    readonly name: string;
    readonly type: TypeInfo;
}

export interface EnumDeclNode extends AstNodeBase<"EnumDecl"> {
    readonly fixedUnderlyingType?: TypeInfo;
    readonly id: ClangNodeId;
    readonly isReferenced?: boolean;
    readonly name?: string;
    readonly scopedEnumTag?: ScopedEnumTag;
}

export interface EnumTypeNode extends AstNodeBase<"EnumType"> {
    readonly decl: AstNode;
    readonly id: ClangNodeId;
    readonly type: TypeInfo;
}

export interface ExcludeFromExplicitInstantiationAttrNode extends AstNodeBase<"ExcludeFromExplicitInstantiationAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface ExprWithCleanupsNode extends AstNodeBase<"ExprWithCleanups"> {
    readonly cleanupsHaveSideEffects?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface FallThroughAttrNode extends AstNodeBase<"FallThroughAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface FieldDeclNode extends AstNodeBase<"FieldDecl"> {
    readonly hasInClassInitializer?: boolean;
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly mutable?: boolean;
    readonly name?: string;
    readonly type: TypeInfo;
}

export interface FloatingLiteralNode extends AstNodeBase<"FloatingLiteral"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: string;
    readonly valueCategory: ValueCategory;
}

export interface ForStmtNode extends AstNodeBase<"ForStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface FormatAttrNode extends AstNodeBase<"FormatAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface FriendDeclNode extends AstNodeBase<"FriendDecl"> {
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly range: SourceRange;
    readonly type?: TypeInfo;
}

export interface FullCommentNode extends AstNodeBase<"FullComment"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface FunctionDeclNode extends AstNodeBase<"FunctionDecl"> {
    readonly constexpr?: boolean;
    readonly explicitlyDefaulted?: ExplicitlyDefaultedKind;
    readonly explicitlyDeleted?: boolean;
    readonly id: ClangNodeId;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly storageClass?: StorageClass;
    readonly type: TypeInfo;
    readonly variadic?: boolean;
}

export interface FunctionProtoTypeNode extends AstNodeBase<"FunctionProtoType"> {
    readonly cc: CallingConvention;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
    readonly variadic?: boolean;
}

export interface FunctionTemplateDeclNode extends AstNodeBase<"FunctionTemplateDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
}

export interface GCCAsmStmtNode extends AstNodeBase<"GCCAsmStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface GNUNullExprNode extends AstNodeBase<"GNUNullExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface IfStmtNode extends AstNodeBase<"IfStmt"> {
    readonly hasElse?: boolean;
    readonly hasInit?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isConstexpr?: boolean;
    readonly range: SourceRange;
}

export interface ImplicitCastExprNode extends AstNodeBase<"ImplicitCastExpr"> {
    readonly castKind: CastKind;
    readonly conversionFunc?: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isPartOfExplicitCast?: boolean;
    readonly path?: readonly CastPathElement[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ImplicitConceptSpecializationDeclNode extends AstNodeBase<"ImplicitConceptSpecializationDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface ImplicitValueInitExprNode extends AstNodeBase<"ImplicitValueInitExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface IncompleteArrayTypeNode extends AstNodeBase<"IncompleteArrayType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface IndirectFieldDeclNode extends AstNodeBase<"IndirectFieldDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit: boolean;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface InitListExprNode extends AstNodeBase<"InitListExpr"> {
    readonly array_filler?: readonly AstNode[];
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface InjectedClassNameTypeNode extends AstNodeBase<"InjectedClassNameType"> {
    readonly decl: AstNode;
    readonly id: ClangNodeId;
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface InlineCommandCommentNode extends AstNodeBase<"InlineCommandComment"> {
    readonly args: readonly string[];
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
    readonly renderKind: CommentRenderKind;
}

export interface IntegerLiteralNode extends AstNodeBase<"IntegerLiteral"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: string;
    readonly valueCategory: ValueCategory;
}

export interface LValueReferenceTypeNode extends AstNodeBase<"LValueReferenceType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface LambdaExprNode extends AstNodeBase<"LambdaExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface LifetimeBoundAttrNode extends AstNodeBase<"LifetimeBoundAttr"> {
    readonly id: ClangNodeId;
    readonly implicit?: boolean;
    readonly range: SourceRange;
}

export interface LinkageSpecDeclNode extends AstNodeBase<"LinkageSpecDecl"> {
    readonly hasBraces?: boolean;
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly language: LanguageKind;
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface MaterializeTemporaryExprNode extends AstNodeBase<"MaterializeTemporaryExpr"> {
    readonly boundToLValueRef?: boolean;
    readonly extendingDecl?: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly storageDuration: StorageDuration;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface MemberExprNode extends AstNodeBase<"MemberExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isArrow: boolean;
    readonly name: string;
    readonly range: SourceRange;
    readonly referencedMemberDecl: ClangNodeId;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface MemberPointerTypeNode extends AstNodeBase<"MemberPointerType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isData?: boolean;
    readonly isDependent?: boolean;
    readonly isFunction?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface NamespaceDeclNode extends AstNodeBase<"NamespaceDecl"> {
    readonly id: ClangNodeId;
    readonly isInline?: boolean;
    readonly name?: string;
    readonly originalNamespace?: AstNode;
    readonly previousDecl?: ClangNodeId;
}

export interface NestedRequirementNode extends AstNodeBase<"NestedRequirement"> {
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
}

export interface NoDebugAttrNode extends AstNodeBase<"NoDebugAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface NoSanitizeAttrNode extends AstNodeBase<"NoSanitizeAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface NoThrowAttrNode extends AstNodeBase<"NoThrowAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly range: SourceRange;
}

export interface NoUniqueAddressAttrNode extends AstNodeBase<"NoUniqueAddressAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface NonTypeTemplateParmDeclNode extends AstNodeBase<"NonTypeTemplateParmDecl"> {
    readonly defaultArg?: TemplateArgumentNode;
    readonly depth?: number;
    readonly id: ClangNodeId;
    readonly index?: number;
    readonly isImplicit?: boolean;
    readonly isParameterPack?: boolean;
    readonly isReferenced?: boolean;
    readonly name?: string;
    readonly type: TypeInfo;
}

export interface NullStmtNode extends AstNodeBase<"NullStmt"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface OffsetOfExprNode extends AstNodeBase<"OffsetOfExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface OpaqueValueExprNode extends AstNodeBase<"OpaqueValueExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface OverrideAttrNode extends AstNodeBase<"OverrideAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface OwnerAttrNode extends AstNodeBase<"OwnerAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly inherited?: boolean;
    readonly range: SourceRange;
}

export interface PackExpansionExprNode extends AstNodeBase<"PackExpansionExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface PackExpansionTypeNode extends AstNodeBase<"PackExpansionType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface PackedAttrNode extends AstNodeBase<"PackedAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface ParagraphCommentNode extends AstNodeBase<"ParagraphComment"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface ParamCommandCommentNode extends AstNodeBase<"ParamCommandComment"> {
    readonly direction: CommentDirection;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly param: string;
    readonly paramIdx: number;
    readonly range: SourceRange;
}

export interface ParenExprNode extends AstNodeBase<"ParenExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ParenListExprNode extends AstNodeBase<"ParenListExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface ParenTypeNode extends AstNodeBase<"ParenType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface ParmVarDeclNode extends AstNodeBase<"ParmVarDecl"> {
    readonly id: ClangNodeId;
    readonly init?: InitializationKind;
    readonly isImplicit?: boolean;
    readonly isParameterPack?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly name?: string;
    readonly type: TypeInfo;
}

export interface PointerAttrNode extends AstNodeBase<"PointerAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly range: SourceRange;
}

export interface PointerTypeNode extends AstNodeBase<"PointerType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface PreferredNameAttrNode extends AstNodeBase<"PreferredNameAttr"> {
    readonly id: ClangNodeId;
    readonly inherited?: boolean;
    readonly range: SourceRange;
}

export interface PureAttrNode extends AstNodeBase<"PureAttr"> {
    readonly id: ClangNodeId;
    readonly implicit: boolean;
    readonly range: SourceRange;
}

export interface QualTypeNode extends AstNodeBase<"QualType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly qualifiers: CvQualifier;
    readonly type: TypeInfo;
}

export interface RValueReferenceTypeNode extends AstNodeBase<"RValueReferenceType"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly type: TypeInfo;
}

export interface RecordTypeNode extends AstNodeBase<"RecordType"> {
    readonly decl: AstNode;
    readonly id: ClangNodeId;
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface RequiresExprNode extends AstNodeBase<"RequiresExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface RestrictAttrNode extends AstNodeBase<"RestrictAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface ReturnStmtNode extends AstNodeBase<"ReturnStmt"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface SimpleRequirementNode extends AstNodeBase<"SimpleRequirement"> {
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
}

export interface SizeOfPackExprNode extends AstNodeBase<"SizeOfPackExpr"> {
    readonly id: ClangNodeId;
    readonly name: string;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface StaticAssertDeclNode extends AstNodeBase<"StaticAssertDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface StringLiteralNode extends AstNodeBase<"StringLiteral"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly value: string;
    readonly valueCategory: ValueCategory;
}

export interface SubstNonTypeTemplateParmExprNode extends AstNodeBase<"SubstNonTypeTemplateParmExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface SubstTemplateTypeParmTypeNode extends AstNodeBase<"SubstTemplateTypeParmType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly index: number;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly pack_index?: number;
    readonly type: TypeInfo;
}

export interface SwitchStmtNode extends AstNodeBase<"SwitchStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface TParamCommandCommentNode extends AstNodeBase<"TParamCommandComment"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly param: string;
    readonly positions?: readonly number[];
    readonly range: SourceRange;
}

export interface TemplateArgumentNode extends AstNodeBase<"TemplateArgument"> {
    readonly "inherited from"?: AstNode;
    readonly isExpr?: boolean;
    readonly isPack?: boolean;
    readonly type?: TypeInfo;
    readonly value?: number;
}

export interface TemplateSpecializationTypeNode extends AstNodeBase<"TemplateSpecializationType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isAlias?: boolean;
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly templateName: string;
    readonly type: TypeInfo;
}

export interface TemplateTemplateParmDeclNode extends AstNodeBase<"TemplateTemplateParmDecl"> {
    readonly depth: number;
    readonly id: ClangNodeId;
    readonly index: number;
    readonly inner: readonly AstNode[];
    readonly isImplicit?: boolean;
    readonly loc: SourceLocation;
    readonly name?: string;
    readonly range: SourceRange;
}

export interface TemplateTypeParmDeclNode extends AstNodeBase<"TemplateTypeParmDecl"> {
    readonly defaultArg?: TemplateArgumentNode;
    readonly depth?: number;
    readonly id: ClangNodeId;
    readonly index?: number;
    readonly isImplicit?: boolean;
    readonly isParameterPack?: boolean;
    readonly isReferenced?: boolean;
    readonly name?: string;
    readonly tagUsed?: TagKind;
}

export interface TemplateTypeParmTypeNode extends AstNodeBase<"TemplateTypeParmType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly decl: AstNode;
    readonly depth: number;
    readonly id: ClangNodeId;
    readonly index: number;
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly isPack?: boolean;
    readonly type: TypeInfo;
}

export interface TextCommentNode extends AstNodeBase<"TextComment"> {
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly range: SourceRange;
    readonly text: string;
}

export interface TranslationUnitDeclNode extends AstNodeBase<"TranslationUnitDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly range: SourceRange;
}

export interface TypeAliasDeclNode extends AstNodeBase<"TypeAliasDecl"> {
    readonly id: ClangNodeId;
    readonly isReferenced?: boolean;
    readonly name: string;
    readonly type?: TypeInfo;
}

export interface TypeAliasTemplateDeclNode extends AstNodeBase<"TypeAliasTemplateDecl"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly previousDecl?: ClangNodeId;
    readonly range: SourceRange;
}

export interface TypeRequirementNode extends AstNodeBase<"TypeRequirement"> {
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
}

export interface TypeTraitExprNode extends AstNodeBase<"TypeTraitExpr"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface TypeVisibilityAttrNode extends AstNodeBase<"TypeVisibilityAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface TypedefDeclNode extends AstNodeBase<"TypedefDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly name: string;
    readonly previousDecl?: ClangNodeId;
    readonly type?: TypeInfo;
}

export interface TypedefTypeNode extends AstNodeBase<"TypedefType"> {
    readonly decl: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent?: boolean;
    readonly isInstantiationDependent?: boolean;
    readonly type: TypeInfo;
}

export interface UnaryExprOrTypeTraitExprNode extends AstNodeBase<"UnaryExprOrTypeTraitExpr"> {
    readonly argType?: TypeInfo;
    readonly id: ClangNodeId;
    readonly name: string;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface UnaryOperatorNode extends AstNodeBase<"UnaryOperator"> {
    readonly canOverflow?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isPostfix: boolean;
    readonly opcode: OperatorOpcode;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface UnaryTransformTypeNode extends AstNodeBase<"UnaryTransformType"> {
    readonly containsUnexpandedPack?: boolean;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly isDependent: boolean;
    readonly isInstantiationDependent: boolean;
    readonly transformKind: TypeTransformKind;
    readonly type: TypeInfo;
}

export interface UnresolvedLookupExprNode extends AstNodeBase<"UnresolvedLookupExpr"> {
    readonly id: ClangNodeId;
    readonly lookups: readonly AstNode[];
    readonly name: string;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly usesADL: boolean;
    readonly valueCategory: ValueCategory;
}

export interface UnresolvedMemberExprNode extends AstNodeBase<"UnresolvedMemberExpr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
    readonly valueCategory: ValueCategory;
}

export interface UnresolvedUsingValueDeclNode extends AstNodeBase<"UnresolvedUsingValueDecl"> {
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface UnusedAttrNode extends AstNodeBase<"UnusedAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface UsingDeclNode extends AstNodeBase<"UsingDecl"> {
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface UsingDirectiveDeclNode extends AstNodeBase<"UsingDirectiveDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit: boolean;
    readonly loc: SourceLocation;
    readonly nominatedNamespace: AstNode;
    readonly range: SourceRange;
}

export interface UsingIfExistsAttrNode extends AstNodeBase<"UsingIfExistsAttr"> {
    readonly id: ClangNodeId;
    readonly range: SourceRange;
}

export interface UsingShadowDeclNode extends AstNodeBase<"UsingShadowDecl"> {
    readonly id: ClangNodeId;
    readonly isImplicit?: boolean;
    readonly name?: string;
    readonly previousDecl?: ClangNodeId;
    readonly target?: AstNode;
}

export interface UsingTypeNode extends AstNodeBase<"UsingType"> {
    readonly decl: AstNode;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly type: TypeInfo;
}

export interface VarDeclNode extends AstNodeBase<"VarDecl"> {
    readonly constexpr?: boolean;
    readonly id: ClangNodeId;
    readonly init?: InitializationKind;
    readonly inline?: boolean;
    readonly isImplicit?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly nrvo?: boolean;
    readonly parentDeclContextId?: ClangNodeId;
    readonly previousDecl?: ClangNodeId;
    readonly storageClass?: StorageClass;
    readonly type: TypeInfo;
}

export interface VarTemplateDeclNode extends AstNodeBase<"VarTemplateDecl"> {
    readonly id: ClangNodeId;
    readonly name: string;
}

export interface VarTemplatePartialSpecializationDeclNode extends AstNodeBase<"VarTemplatePartialSpecializationDecl"> {
    readonly constexpr?: boolean;
    readonly id: ClangNodeId;
    readonly init: InitializationKind;
    readonly inline: boolean;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly parentDeclContextId?: ClangNodeId;
    readonly range: SourceRange;
    readonly type: TypeInfo;
}

export interface VarTemplateSpecializationDeclNode extends AstNodeBase<"VarTemplateSpecializationDecl"> {
    readonly constexpr?: boolean;
    readonly id: ClangNodeId;
    readonly init?: InitializationKind;
    readonly inline?: boolean;
    readonly isReferenced?: boolean;
    readonly isUsed?: boolean;
    readonly mangledName?: string;
    readonly name: string;
    readonly type: TypeInfo;
}

export interface VerbatimBlockCommentNode extends AstNodeBase<"VerbatimBlockComment"> {
    readonly closeName: string;
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly loc: SourceLocation;
    readonly name: string;
    readonly range: SourceRange;
}

export interface VerbatimBlockLineCommentNode extends AstNodeBase<"VerbatimBlockLineComment"> {
    readonly id: ClangNodeId;
    readonly loc: SourceLocation;
    readonly range: SourceRange;
    readonly text: string;
}

export interface VisibilityAttrNode extends AstNodeBase<"VisibilityAttr"> {
    readonly id: ClangNodeId;
    readonly implicit?: boolean;
    readonly inherited?: boolean;
    readonly range: SourceRange;
    readonly visibility: VisibilityKind;
}

export interface WarnUnusedResultAttrNode extends AstNodeBase<"WarnUnusedResultAttr"> {
    readonly id: ClangNodeId;
    readonly inherited?: boolean;
    readonly range: SourceRange;
}

export interface WhileStmtNode extends AstNodeBase<"WhileStmt"> {
    readonly id: ClangNodeId;
    readonly inner: readonly AstNode[];
    readonly range: SourceRange;
}

export interface AstNodeMap {
    readonly "AbiTagAttr": AbiTagAttrNode;
    readonly "AccessSpecDecl": AccessSpecDeclNode;
    readonly "AlignedAttr": AlignedAttrNode;
    readonly "AllocAlignAttr": AllocAlignAttrNode;
    readonly "AllocSizeAttr": AllocSizeAttrNode;
    readonly "AlwaysInlineAttr": AlwaysInlineAttrNode;
    readonly "ArrayInitIndexExpr": ArrayInitIndexExprNode;
    readonly "ArrayInitLoopExpr": ArrayInitLoopExprNode;
    readonly "ArraySubscriptExpr": ArraySubscriptExprNode;
    readonly "ArrayTypeTraitExpr": ArrayTypeTraitExprNode;
    readonly "AttributedStmt": AttributedStmtNode;
    readonly "AvailableOnlyInDefaultEvalMethodAttr": AvailableOnlyInDefaultEvalMethodAttrNode;
    readonly "BinaryOperator": BinaryOperatorNode;
    readonly "BlockCommandComment": BlockCommandCommentNode;
    readonly "BreakStmt": BreakStmtNode;
    readonly "BuiltinAttr": BuiltinAttrNode;
    readonly "BuiltinBitCastExpr": BuiltinBitCastExprNode;
    readonly "BuiltinTemplateDecl": BuiltinTemplateDeclNode;
    readonly "BuiltinType": BuiltinTypeNode;
    readonly "CStyleCastExpr": CStyleCastExprNode;
    readonly "CXX11NoReturnAttr": CXX11NoReturnAttrNode;
    readonly "CXXBindTemporaryExpr": CXXBindTemporaryExprNode;
    readonly "CXXBoolLiteralExpr": CXXBoolLiteralExprNode;
    readonly "CXXConstCastExpr": CXXConstCastExprNode;
    readonly "CXXConstructExpr": CXXConstructExprNode;
    readonly "CXXConstructorDecl": CXXConstructorDeclNode;
    readonly "CXXConversionDecl": CXXConversionDeclNode;
    readonly "CXXCtorInitializer": CXXCtorInitializerNode;
    readonly "CXXDeductionGuideDecl": CXXDeductionGuideDeclNode;
    readonly "CXXDefaultArgExpr": CXXDefaultArgExprNode;
    readonly "CXXDeleteExpr": CXXDeleteExprNode;
    readonly "CXXDependentScopeMemberExpr": CXXDependentScopeMemberExprNode;
    readonly "CXXDestructorDecl": CXXDestructorDeclNode;
    readonly "CXXFoldExpr": CXXFoldExprNode;
    readonly "CXXForRangeStmt": CXXForRangeStmtNode;
    readonly "CXXFunctionalCastExpr": CXXFunctionalCastExprNode;
    readonly "CXXMemberCallExpr": CXXMemberCallExprNode;
    readonly "CXXMethodDecl": CXXMethodDeclNode;
    readonly "CXXNewExpr": CXXNewExprNode;
    readonly "CXXNoexceptExpr": CXXNoexceptExprNode;
    readonly "CXXNullPtrLiteralExpr": CXXNullPtrLiteralExprNode;
    readonly "CXXOperatorCallExpr": CXXOperatorCallExprNode;
    readonly "CXXPseudoDestructorExpr": CXXPseudoDestructorExprNode;
    readonly "CXXRecordDecl": CXXRecordDeclNode;
    readonly "CXXReinterpretCastExpr": CXXReinterpretCastExprNode;
    readonly "CXXRewrittenBinaryOperator": CXXRewrittenBinaryOperatorNode;
    readonly "CXXScalarValueInitExpr": CXXScalarValueInitExprNode;
    readonly "CXXStaticCastExpr": CXXStaticCastExprNode;
    readonly "CXXTemporaryObjectExpr": CXXTemporaryObjectExprNode;
    readonly "CXXThisExpr": CXXThisExprNode;
    readonly "CXXUnresolvedConstructExpr": CXXUnresolvedConstructExprNode;
    readonly "CallExpr": CallExprNode;
    readonly "CaseStmt": CaseStmtNode;
    readonly "CharacterLiteral": CharacterLiteralNode;
    readonly "ClassTemplateDecl": ClassTemplateDeclNode;
    readonly "ClassTemplatePartialSpecializationDecl": ClassTemplatePartialSpecializationDeclNode;
    readonly "ClassTemplateSpecializationDecl": ClassTemplateSpecializationDeclNode;
    readonly "CompoundAssignOperator": CompoundAssignOperatorNode;
    readonly "CompoundRequirement": CompoundRequirementNode;
    readonly "CompoundStmt": CompoundStmtNode;
    readonly "ConceptDecl": ConceptDeclNode;
    readonly "ConceptSpecializationExpr": ConceptSpecializationExprNode;
    readonly "ConditionalOperator": ConditionalOperatorNode;
    readonly "ConstAttr": ConstAttrNode;
    readonly "ConstantArrayType": ConstantArrayTypeNode;
    readonly "ConstantExpr": ConstantExprNode;
    readonly "ContinueStmt": ContinueStmtNode;
    readonly "DeclRefExpr": DeclRefExprNode;
    readonly "DeclStmt": DeclStmtNode;
    readonly "DecltypeType": DecltypeTypeNode;
    readonly "DefaultStmt": DefaultStmtNode;
    readonly "DependentNameType": DependentNameTypeNode;
    readonly "DependentScopeDeclRefExpr": DependentScopeDeclRefExprNode;
    readonly "DependentSizedArrayType": DependentSizedArrayTypeNode;
    readonly "DependentTemplateSpecializationType": DependentTemplateSpecializationTypeNode;
    readonly "DeprecatedAttr": DeprecatedAttrNode;
    readonly "DoStmt": DoStmtNode;
    readonly "ElaboratedType": ElaboratedTypeNode;
    readonly "EnableIfAttr": EnableIfAttrNode;
    readonly "EnumConstantDecl": EnumConstantDeclNode;
    readonly "EnumDecl": EnumDeclNode;
    readonly "EnumType": EnumTypeNode;
    readonly "ExcludeFromExplicitInstantiationAttr": ExcludeFromExplicitInstantiationAttrNode;
    readonly "ExprWithCleanups": ExprWithCleanupsNode;
    readonly "FallThroughAttr": FallThroughAttrNode;
    readonly "FieldDecl": FieldDeclNode;
    readonly "FloatingLiteral": FloatingLiteralNode;
    readonly "ForStmt": ForStmtNode;
    readonly "FormatAttr": FormatAttrNode;
    readonly "FriendDecl": FriendDeclNode;
    readonly "FullComment": FullCommentNode;
    readonly "FunctionDecl": FunctionDeclNode;
    readonly "FunctionProtoType": FunctionProtoTypeNode;
    readonly "FunctionTemplateDecl": FunctionTemplateDeclNode;
    readonly "GCCAsmStmt": GCCAsmStmtNode;
    readonly "GNUNullExpr": GNUNullExprNode;
    readonly "IfStmt": IfStmtNode;
    readonly "ImplicitCastExpr": ImplicitCastExprNode;
    readonly "ImplicitConceptSpecializationDecl": ImplicitConceptSpecializationDeclNode;
    readonly "ImplicitValueInitExpr": ImplicitValueInitExprNode;
    readonly "IncompleteArrayType": IncompleteArrayTypeNode;
    readonly "IndirectFieldDecl": IndirectFieldDeclNode;
    readonly "InitListExpr": InitListExprNode;
    readonly "InjectedClassNameType": InjectedClassNameTypeNode;
    readonly "InlineCommandComment": InlineCommandCommentNode;
    readonly "IntegerLiteral": IntegerLiteralNode;
    readonly "LValueReferenceType": LValueReferenceTypeNode;
    readonly "LambdaExpr": LambdaExprNode;
    readonly "LifetimeBoundAttr": LifetimeBoundAttrNode;
    readonly "LinkageSpecDecl": LinkageSpecDeclNode;
    readonly "MaterializeTemporaryExpr": MaterializeTemporaryExprNode;
    readonly "MemberExpr": MemberExprNode;
    readonly "MemberPointerType": MemberPointerTypeNode;
    readonly "NamespaceDecl": NamespaceDeclNode;
    readonly "NestedRequirement": NestedRequirementNode;
    readonly "NoDebugAttr": NoDebugAttrNode;
    readonly "NoSanitizeAttr": NoSanitizeAttrNode;
    readonly "NoThrowAttr": NoThrowAttrNode;
    readonly "NoUniqueAddressAttr": NoUniqueAddressAttrNode;
    readonly "NonTypeTemplateParmDecl": NonTypeTemplateParmDeclNode;
    readonly "NullStmt": NullStmtNode;
    readonly "OffsetOfExpr": OffsetOfExprNode;
    readonly "OpaqueValueExpr": OpaqueValueExprNode;
    readonly "OverrideAttr": OverrideAttrNode;
    readonly "OwnerAttr": OwnerAttrNode;
    readonly "PackExpansionExpr": PackExpansionExprNode;
    readonly "PackExpansionType": PackExpansionTypeNode;
    readonly "PackedAttr": PackedAttrNode;
    readonly "ParagraphComment": ParagraphCommentNode;
    readonly "ParamCommandComment": ParamCommandCommentNode;
    readonly "ParenExpr": ParenExprNode;
    readonly "ParenListExpr": ParenListExprNode;
    readonly "ParenType": ParenTypeNode;
    readonly "ParmVarDecl": ParmVarDeclNode;
    readonly "PointerAttr": PointerAttrNode;
    readonly "PointerType": PointerTypeNode;
    readonly "PreferredNameAttr": PreferredNameAttrNode;
    readonly "PureAttr": PureAttrNode;
    readonly "QualType": QualTypeNode;
    readonly "RValueReferenceType": RValueReferenceTypeNode;
    readonly "RecordType": RecordTypeNode;
    readonly "RequiresExpr": RequiresExprNode;
    readonly "RestrictAttr": RestrictAttrNode;
    readonly "ReturnStmt": ReturnStmtNode;
    readonly "SimpleRequirement": SimpleRequirementNode;
    readonly "SizeOfPackExpr": SizeOfPackExprNode;
    readonly "StaticAssertDecl": StaticAssertDeclNode;
    readonly "StringLiteral": StringLiteralNode;
    readonly "SubstNonTypeTemplateParmExpr": SubstNonTypeTemplateParmExprNode;
    readonly "SubstTemplateTypeParmType": SubstTemplateTypeParmTypeNode;
    readonly "SwitchStmt": SwitchStmtNode;
    readonly "TParamCommandComment": TParamCommandCommentNode;
    readonly "TemplateArgument": TemplateArgumentNode;
    readonly "TemplateSpecializationType": TemplateSpecializationTypeNode;
    readonly "TemplateTemplateParmDecl": TemplateTemplateParmDeclNode;
    readonly "TemplateTypeParmDecl": TemplateTypeParmDeclNode;
    readonly "TemplateTypeParmType": TemplateTypeParmTypeNode;
    readonly "TextComment": TextCommentNode;
    readonly "TranslationUnitDecl": TranslationUnitDeclNode;
    readonly "TypeAliasDecl": TypeAliasDeclNode;
    readonly "TypeAliasTemplateDecl": TypeAliasTemplateDeclNode;
    readonly "TypeRequirement": TypeRequirementNode;
    readonly "TypeTraitExpr": TypeTraitExprNode;
    readonly "TypeVisibilityAttr": TypeVisibilityAttrNode;
    readonly "TypedefDecl": TypedefDeclNode;
    readonly "TypedefType": TypedefTypeNode;
    readonly "UnaryExprOrTypeTraitExpr": UnaryExprOrTypeTraitExprNode;
    readonly "UnaryOperator": UnaryOperatorNode;
    readonly "UnaryTransformType": UnaryTransformTypeNode;
    readonly "UnresolvedLookupExpr": UnresolvedLookupExprNode;
    readonly "UnresolvedMemberExpr": UnresolvedMemberExprNode;
    readonly "UnresolvedUsingValueDecl": UnresolvedUsingValueDeclNode;
    readonly "UnusedAttr": UnusedAttrNode;
    readonly "UsingDecl": UsingDeclNode;
    readonly "UsingDirectiveDecl": UsingDirectiveDeclNode;
    readonly "UsingIfExistsAttr": UsingIfExistsAttrNode;
    readonly "UsingShadowDecl": UsingShadowDeclNode;
    readonly "UsingType": UsingTypeNode;
    readonly "VarDecl": VarDeclNode;
    readonly "VarTemplateDecl": VarTemplateDeclNode;
    readonly "VarTemplatePartialSpecializationDecl": VarTemplatePartialSpecializationDeclNode;
    readonly "VarTemplateSpecializationDecl": VarTemplateSpecializationDeclNode;
    readonly "VerbatimBlockComment": VerbatimBlockCommentNode;
    readonly "VerbatimBlockLineComment": VerbatimBlockLineCommentNode;
    readonly "VisibilityAttr": VisibilityAttrNode;
    readonly "WarnUnusedResultAttr": WarnUnusedResultAttrNode;
    readonly "WhileStmt": WhileStmtNode;
}

export type AstNodeKind = keyof AstNodeMap;
export type AstNode = AstNodeMap[AstNodeKind];
export type NodeOfKind<K extends AstNodeKind> = AstNodeMap[K];

export type ClangAst = TranslationUnitDeclNode;

export function isNodeKind<K extends AstNodeKind>(
    node: AstNode,
    kind: K,
): node is NodeOfKind<K> {
    return node.kind === kind;
}
