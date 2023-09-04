import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useActivityGroupsListStyles = createUseStyles(({ colors, typography }) => ({
  sectionListContentContainer: {
    paddingTop: formatSize(8),
    paddingBottom: formatSize(16),
    paddingLeft: formatSize(16)
  },
  sectionHeaderText: {
    ...typography.numbersMedium13,
    color: colors.gray2,
    backgroundColor: colors.pageBG,
    paddingVertical: formatSize(4)
  },
  promotionItemWrapper: {
    paddingVertical: formatSize(12),
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  centeredItem: {
    alignSelf: 'center'
  },
  initialLoader: {
    paddingTop: formatSize(128)
  },
  additionalLoader: {
    paddingTop: formatSize(16)
  },
  promotionItem: {
    width: formatSize(343)
  }
}));
