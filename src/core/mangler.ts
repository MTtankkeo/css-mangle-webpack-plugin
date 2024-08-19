
export class ManglerObject {
    originName: string;
    identifierName: string;
    referenceCount: number;
}

export class Mangler {
    count: number = 0;
    chars = "abcdefghijklmnopqrstuvwxyz";
    cache = new Map<string, ManglerObject>();

    createName(count = this.count++): string {
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
        let object = this.cache.get(from);
        if (object) {
            return object.referenceCount += 1, object.identifierName;
        }

        this.cache.set(from, {
            originName: from,
            identifierName: this.createName(),
            referenceCount: 0,
        })

        return this.cache.get(from).identifierName;
    }

    CSSVariableOf(value: string): string {
        return this.cache.get(value) ? `--${this.transform(value)}` : value;
    }

    printLogs() {
        console.log(this.cache);
    }

    printLogsUnused() {
        for (const object of this.cache.values()) {
            if (object.referenceCount == 0) console.log(`${object.originName} is not referenced.`);
        }
    }
}