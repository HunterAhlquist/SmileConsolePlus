class Input {
    /**
     * Enables keyboard for a function
     * @param event event function to notify
     */
    static activateKeyboard(event) {
        document.addEventListener('keydown', function (e) {
            event(e);
        });
    }

    /**
     * Disables keyboard for a function
     * @param event event function to stop notifying
     */
    static deactivateKeyboard(event) {
        document.removeEventListener('keydown', function (e) {
            event(e);
        });
    }
}