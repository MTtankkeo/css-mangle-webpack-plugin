
export class Mangler {
    count: number = 0;
    chars = "abcdefghijklmnopqrstuvwxyz";
    cache = new Map();

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

    CSSVariableOf(value: string): string {
        return this.cache[value] ? `--${this.transform(value)}` : value;
    }
}