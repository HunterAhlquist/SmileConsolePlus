class Util {
    /**
     *
     * @param array {[any]}
     * @return {boolean}
     */
    static isEmpty(array) {
        return Array.isArray(array) && (array.length === 0 || array.every(a => this.isEmpty(a)));
    }
}
