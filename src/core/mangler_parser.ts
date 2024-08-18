import { Mangler } from "./mangler";

export class ManglerParser {
    static variable(syntexText: string) {
        const regexps = syntexText.matchAll(/--\w+(?=\s*:)/g);

        for (const regexp of regexps) {
            Mangler.instance.transform(regexp[0]);
        }
    }
}