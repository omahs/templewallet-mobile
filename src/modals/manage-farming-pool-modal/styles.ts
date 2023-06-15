import { black } from 'src/config/styles';
import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useManageFarmingPoolModalStyles = createUseStyles(({ colors, typography }) => ({
  background: {
    backgroundColor: colors.pageBG,
    flex: 1,
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(16)
  },
  depositPrompt: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    color: colors.gray1
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  content: {
    flex: 1
  },
  notSupportedText: {
    color: colors.black
  },
  disclaimerDescriptionText: {
    ...typography.caption13Regular,
    letterSpacing: formatSize(-0.08),
    lineHeight: formatSize(18),
    color: colors.black
  },
  emphasized: {
    ...typography.caption13Semibold
  },
  detailsTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: formatSize(8)
  },
  farmTypeIconWrapper: {
    padding: formatSize(4),
    borderRadius: formatSize(4),
    borderWidth: formatSize(0.5),
    borderColor: colors.lines
  },
  quipuswapIconWrapper: {
    backgroundColor: black
  },
  liquidityBakingIconWrapper: {
    backgroundColor: colors.blue
  },
  detailsTitleText: {
    ...typography.body15Semibold,
    color: colors.black,
    letterSpacing: formatSize(-0.24)
  },
  restContainer: {
    flex: 1
  }
}));
