import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectionStyles = createUseStyles(({ colors }) => ({
  root: {
    flex: 1,
    marginVertical: formatSize(12)
  },
  emptyBlock: {
    width: formatSize(20)
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: formatSize(335)
  },
  loader: {
    width: formatSize(335),
    justifyContent: 'center'
  },
  collectibleContainer: {
    flex: 1,
    borderWidth: formatSize(1),
    borderRadius: formatSize(10),
    borderColor: colors.lines,
    backgroundColor: colors.navigation,
    width: formatSize(327),
    marginHorizontal: formatSize(4),
    position: 'relative'
  }
}));
