#include <telkin/Hooks.h>

// Fix Glow Blocks not spawning properly in NSMBU
tPatchNop(0x0270A938); // GlowBlockLift::execute
