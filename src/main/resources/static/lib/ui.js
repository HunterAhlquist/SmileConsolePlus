class SmileUI_Rect {
    /**
     * position x axis
     * @type {number}
     */
    x;
    /**
     * position y axis
     * @type {number}
     */
    y;
    /**
     * width
     * @type {number}
     */
    width;
    /**
     * height
     * @type {number}
     */
    height;
}



class SmileUI_Object {
    /**
     * Child objects
     * @type {SmileUI_Object[]}
     */
    children = [];
    /**
     *
     * @type {SmileUI_Rect}
     */
    rect = new SmileUI_Rect();
    /**
     * background color
     * @type {string}
     */
    bgCol;
    /**
     * accent color
     * @type {string}
     */
    accentCol;

    /**
     * accent color
     * @type {number}
     */
    outlineThickness;

    /**
     * @interface SmileUI_Object
     * @param buffer {[[number], [number]]}
     */
    render(buffer) {
        return GFX.drawRect(buffer, this.outlineThickness, this.accentCol, this.bgCol, this.rect.x, this.rect.y, this.rect.width, this.rect.height)
    }
}

class SmileUI_View {
    /**
     * @type {SmileUI_Object}
     */
    root;
    /**
     * @type {SmileUI_Interact}
     */
    selected;
    /**
     * Frame buffer pre-drawn cache
     * @type {[[],[]]}
     */
    cache;

    refreshCache() {
        if (this.cache === undefined || Util.isEmpty(this.cache)) {

        }
    }
}

class SmileUI_Window extends SmileUI_Object {

}

class SmileUI_Label extends SmileUI_Object {

}

class SmileUI_Interact extends SmileUI_Object  {
    onSelect() {

    }
    onUse() {

    }
    onDeselect() {

    }
}

class SmileUI_TextField extends SmileUI_Interact {

}

class SmileUI_Button extends SmileUI_Interact{

}