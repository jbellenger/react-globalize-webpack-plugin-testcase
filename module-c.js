import { FormatMessage } from 'react-globalize';

// even though it's not used, importing globalize causes the 'bar' string to be
// incorporated into the chunkhash
import Globalize from 'globalize';

const message = <FormatMessage>{'bar'}</FormatMessage>;
