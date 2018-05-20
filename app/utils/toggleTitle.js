module.exports = (store, title, appMenu) => {
  const selectedTitle = store.get('selectedTitle');
  // change title if required
  if (selectedTitle !== title) {
    // uncheck/check selected menu item
    appMenu.getMenuItemById(selectedTitle).checked = false;
    appMenu.getMenuItemById(title).checked = true;
    store.set('selectedTitle', title);
  }
};
