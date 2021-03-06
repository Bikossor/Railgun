import { Parser } from "../Parser";
import { updateParserError, updateParserResult } from "../ParserState";
/**
 * Accepts multiple parsers, which must all match successfully in the given order otherwise it fails.
 * @param parsers
 */
export const sequenceOf = (parsers) => new Parser((state) => {
    let i = 0;
    let results = [];
    let nextState = state;
    do {
        nextState = parsers[i].transformState(nextState);
        results.push(nextState.result);
        if (nextState.isError) {
            return updateParserError(nextState, nextState.errorMessage);
        }
        i++;
    } while (i < parsers.length && !nextState.isError);
    return updateParserResult(nextState, results);
});
