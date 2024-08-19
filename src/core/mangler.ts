
export class Mangler {
    private static _instance: Mangler;
    private constructor() {}

    count: number = 0;
    chars = "abcdefghijklmnopqrstuvwxyz";
    cache = new Map();

    /** Gets a unique instance of the [Mangler] class. */
    static get instance() {
        return this._instance ?? (this._instance = new Mangler());
    }

    createName(count = this.count++) {
        let result = "";
        let length = this.chars.length;

        while (count >= 0) {
            result = this.chars[count % length] + result;

            if (count > 0) {
                count = Math.floor(count / length) - 1;
            } else {
                break;
            }
        }

        return result;
    }

    transform(from: string): string {
        return this.cache[from] ?? (this.cache[from] = this.createName());
    }
}