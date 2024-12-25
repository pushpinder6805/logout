import { withPluginApi } from "discourse/lib/plugin-api";
import logout from "discourse/lib/logout";
import I18n from "I18n";

export default {
  name: "header-logout-component",

  initialize() {
    withPluginApi("1.2.0", (api) => {
      const currentUser = api.getCurrentUser();

      if (currentUser) {
        // Add a logout button to the header
        api.headerButtons("quick-logout", {
          className: "btn btn-icon btn-flat logout-button",
          title: I18n.t(themePrefix("quick_logout")), // Use localization for the button title
          icon: settings.logout_icon || "power-off", // Use custom icon or default to "power-off"
          action() {
            if (confirm(I18n.t(themePrefix("quick_logout_confirm")))) {
              currentUser
                .destroySession()
                .then((response) => logout({ redirect: response.redirect_url }));
            }
          },
        }, { before: "auth" }); // Place the button before auth buttons
      }
    });
  },
};
