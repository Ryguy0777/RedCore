#pragma once

#include <concepts>

#include <actor/ProfileInfo.h>
#include <actor/Actor.h>
#include <red/registry/builder/ProfileBuilder.h>
#include <red/public/Profile.h>
#include <red/profile/ProfileEx.h>
#include <red/event/StaticInitEvent.h>
#include <telkin/Privilege.h>

namespace red {

/**
 * @brief Builder for replacing a vanilla profile with a custom one by its numeric ID.
 * @tparam T Actor class that the profile will now instantiate.
 * @tparam ID The target profile ID to replace.
 */
template <class T, s32 ID> requires std::derived_from<T, ActorBase>
class ProfileReplaceBuilder : public ProfileBuilder<ProfileReplaceBuilder<T, ID>> {
public:
    static_assert(ID <= ProfileInfo::cProfileID_Max, "ERROR: Attempting to replace an invalid vanilla profile ID.");

    ProfileReplaceBuilder()
        : ProfileBuilder<ProfileReplaceBuilder<T, ID>>()
    { }

    /**
     * @brief Completes the builder by replacing the vanilla profile.
     * @return The profile which now contains the replaced data.
     */
    Profile* build() {
        static bool instantiated = false;
        if (instantiated) {
            tk::fatal("Cannot reuse the same template instanciation for two replacements.");
        }
        instantiated = true;

        // defer until the vanilla profile is inited so we have the final say
        static const struct {
            const ActorCreateInfo* mCreateInfo;
            Profile::Flag mFlag;
            s16 mDrawPriority;
            s16 mExecutePriority;
            sead::SafeString* mResources;
            u8 mResourceCount;
            s8 mResourceType;
        } sSnapshot = {
            .mCreateInfo = this->mCreateInfo,
            .mFlag = this->mFlag,
            .mDrawPriority = this->mDrawPriority,
            .mExecutePriority = this->mExecutePriority,
            .mResources = this->mResources,
            .mResourceCount = this->mResourceCount,
            .mResourceType = this->mResourceType
        };

        static red::StaticInitEvent::Listener listener([](red::StaticInitEvent&) {
            pub::Profile* profile = static_cast<pub::Profile*>(Profile::get(ID));

            profile->mFactory = &TActorFactory<T>;
            profile->mActorCreateInfo = sSnapshot.mCreateInfo != nullptr ? sSnapshot.mCreateInfo : &ActorCreateInfo::cDefault;
            profile->mIsResLoaded = false;
            profile->mFlag = sSnapshot.mFlag;
            
            tk::privilegedWrite(&ProfileInfo::cDrawPriority[ID], &sSnapshot.mDrawPriority, sizeof(ProfileInfo::cDrawPriority[ID]));
            tk::privilegedWrite(&ProfileInfo::cResList[ID], &sSnapshot.mResources, sizeof(ProfileInfo::cResList[ID])); // NOLINT
            tk::privilegedWrite(&ProfileInfo::cResNum[ID], &sSnapshot.mResourceCount, sizeof(ProfileInfo::cResNum[ID]));
            tk::privilegedWrite(&ProfileInfo::cResType[ID], &sSnapshot.mResourceType, sizeof(ProfileInfo::cResType[ID]));

            ProfileEx::setExecutePriority(ID, sSnapshot.mExecutePriority);
        });

        return ProfileEx::get(ID);
    }
};

}
