#pragma once

#include <red/public/ProfileInfo.h>
#include <red/registry/builder/ProfileBuilder.h>
#include <red/public/Profile.h>
#include <red/profile/ProfileEx.h>
#include <red/event/StaticInitEvent.h>
#include <telkin/Privilege.h>

namespace red {

/**
 * @brief Builder for partially modifying fields on a vanilla profile by its numeric ID.
 * @details Intended to be constructed via a per-mod @c red::Registrar object.
 * @tparam ID The target profile ID to modify.
 */
template <s32 ID>
class ProfileEditBuilder : public ProfileBuilder<ProfileEditBuilder<ID>> {
public:
    static_assert(ID <= ProfileInfo::cProfileID_Max, "ERROR: Attempting to edit an invalid vanilla profile ID.");

    ProfileEditBuilder()
        : ProfileBuilder<ProfileEditBuilder<ID>>()
    { }

    /**
     * @brief Completes the builder by applying the changes to the vanilla profile.
     * @return The vanilla profile which was modified.
     */
    Profile* build() {
        static bool instantiated = false;
        if (instantiated) {
            tk::fatal("Cannot reuse the same template instanciation for two edits.");
        }
        instantiated = true;

        pub::Profile* profile = static_cast<pub::Profile*>(Profile::get(ID));

        // defer until the vanilla profile is inited so we have the final say
        static const struct {
            const ActorCreateInfo* mCreateInfo;
            bool mCreateInfoModified;
            Profile::Flag mFlag;
            bool mFlagModified;
            s16 mDrawPriority;
            bool mDrawPriorityModified;
            s16 mExecutePriority;
            bool mExecutePriorityModified;
            sead::SafeString* mResources;
            u8 mResourceCount;
            s8 mResourceType;
            bool mResourcesModified;
        } sSnapshot = {
            .mCreateInfo = this->mCreateInfo,
            .mCreateInfoModified = this->mCreateInfoModified,
            .mFlag = this->mFlag,
            .mFlagModified = this->mFlagModified,
            .mDrawPriority = this->mDrawPriority,
            .mDrawPriorityModified = this->mDrawPriorityModified,
            .mExecutePriority = this->mExecutePriority,
            .mExecutePriorityModified = this->mExecutePriorityModified,
            .mResources = this->mResources,
            .mResourceCount = this->mResourceCount,
            .mResourceType = this->mResourceType,
            .mResourcesModified = this->mResourcesModified
        };

        static red::StaticInitEvent::Listener listener([](red::StaticInitEvent&) {
            pub::Profile* profile = static_cast<pub::Profile*>(Profile::get(ID));

            if (sSnapshot.mCreateInfoModified) {
                profile->mActorCreateInfo = sSnapshot.mCreateInfo;
            }

            if (sSnapshot.mFlagModified) {
                profile->mFlag = sSnapshot.mFlag;
            }

            if (sSnapshot.mDrawPriorityModified) {
                tk::privilegedWrite(&ProfileInfo::cDrawPriority[ID], &sSnapshot.mDrawPriority, sizeof(ProfileInfo::cDrawPriority[ID]));
            }

            if (sSnapshot.mExecutePriorityModified) {
                ProfileEx::setExecutePriority(ID, sSnapshot.mExecutePriority);
            }
            
            if (sSnapshot.mResourcesModified) {
                tk::privilegedWrite(&ProfileInfo::cResList[ID], &sSnapshot.mResources, sizeof(ProfileInfo::cResList[ID])); // NOLINT
                tk::privilegedWrite(&ProfileInfo::cResNum[ID], &sSnapshot.mResourceCount, sizeof(ProfileInfo::cResNum[ID]));
                tk::privilegedWrite(&ProfileInfo::cResType[ID], &sSnapshot.mResourceType, sizeof(ProfileInfo::cResType[ID]));
            }
        });

        return profile;
    }

};

}
