import { Mangler } from "./mangler";

export class ManglerTranspiler {
    static replaceRange(str: string, start: number, end: number, replaceValue: string) {
        return str.substring(0, start) + replaceValue + str.substring(end);
    }

    static transform(syntexText: string): string {
        return this.transformVariable(syntexText);
    }

    static transformVariable(syntexText: string): string {
        const regexps = syntexText.matchAll(/(?<=var\()--\w+(?=\))/g);
        let replacedLength = 0;

        for (const regexp of regexps) {
            const name = regexp[0];
            const index = regexp.index - replacedLength;
            const result = this.replaceRange(
                syntexText,
                index,
                index + name.length,
                `--${Mangler.instance.transform(name)}`
            );

            replacedLength += syntexText.length - result.length;
            syntexText = result;
        }
        
        return syntexText;
    }
}