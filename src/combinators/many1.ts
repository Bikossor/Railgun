import { Parser } from "../Parser";
import { ParserStateResult } from "../ParserStateResult";
import { ParserState, updateParserResult, updateParserError } from "../ParserState";

/**
 * Accepts a single parser, which must match at least once or infinite times otherwise it fails.
 * @param parser
 */
export const many1 = (parser: Parser) => new Parser((state: ParserState): ParserState => {
  let results: Array<ParserStateResult> = [];
  let nextState: ParserState = state;
  let done = false;

  while(!done) {
    let testState = parser.transformState(nextState);

    if (!testState.isError) {
      results.push(testState.result);
      nextState = testState;
    } else {
      done = true;
    }
  }

  if (!results.length) {
    return updateParserError(state, `many1: Failed to match at least once at offset ${state.offset}`);
  }

  return updateParserResult(nextState, results);
});
