import { cached } from "@glimmer/tracking";
import { withPluginApi } from "discourse/lib/plugin-api";
import logout from "discourse/lib/logout";
import UserMenuTab from "discourse/lib/user-menu/tab";
import I18n from "I18n";

const CORE_BOTTOM_TABS = [
  // default tab from core
  class extends UserMenuTab {
    get id() {
      return "profile";
    }

    get icon() {
      return "user";
    }

    get panelComponent() {
      return "user-menu/profile-tab-content";
    }

    get linkWhenActive() {
      return `${this.currentUser.path}/summary`;
    }
  },

  // our custom quick logout tab
  class extends UserMenuTab {
    get id() {
      return "quick-logout";
    }

    get icon() {
      return settings.logout_icon;
    }

    get panelComponent() {
      if (this.currentUser) {
        this.currentUser
          .destroySession()
          .then((response) => logout({ redirect: response["redirect_url"] }));
      }
    }

    get title() {
      return I18n.t(themePrefix("quick_logout"));
    }
  },
];

export default {
  name: "quick-logout-component",

  initialize() {
    withPluginApi("1.2.0", (api) => {
      // verbatim from core, just ensuring we pick up our custom tab

      api.modifyClass("component:user-menu/menu", {
        pluginId: "quick-logout-component",

        @cached
        get bottomTabs() {
          const tabs = [];

          CORE_BOTTOM_TABS.forEach((tabClass) => {
            const tab = new tabClass(
              this.currentUser,
              this.siteSettings,
              this.site
            );
            if (tab.shouldDisplay) {
              tabs.push(tab);
            }
          });

          const topTabsLength = this.topTabs.length;
          return tabs.map((tab, index) => {
            tab.position = index + topTabsLength;
            return tab;
          });
        },
      });
    });
  },
};
