import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEarnStyles = createUseStyles(() => ({
  loader: {
    marginTop: formatSize(100)
  }
}));
