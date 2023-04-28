import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectionStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flex: 1,
    marginVertical: formatSize(12),
    marginLeft: formatSize(20)
  },
  NFTcontainer: {
    flex: 1,
    borderWidth: formatSize(1),
    borderRadius: formatSize(10),
    borderColor: colors.lines,
    backgroundColor: colors.navigation,
    width: '100%',
    marginHorizontal: formatSize(4)
  },
  NFT: {
    margin: formatSize(16)
  },
  image: {
    borderRadius: formatSize(8),
    width: formatSize(295),
    height: formatSize(283)
  },
  NFTname: {
    color: colors.black,
    marginTop: formatSize(12),
    maxWidth: formatSize(200),
    ...typography.body20Bold
  },
  NFTdescription: {
    color: colors.black,
    marginTop: formatSize(8),
    maxWidth: formatSize(200),
    ...typography.caption13Regular
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: formatSize(16)
  },
  containerLeft: {
    width: '50%',
    paddingLeft: formatSize(4)
  },
  containerRight: {
    width: '50%',
    paddingRight: formatSize(4)
  },
  smallContainer: {
    borderWidth: formatSize(1),
    borderColor: colors.lines,
    borderRadius: formatSize(10),
    paddingVertical: formatSize(8),
    alignItems: 'flex-start',
    paddingLeft: formatSize(12)
  },
  text: {
    color: colors.gray1,
    ...typography.caption13Regular
  },
  value: {
    color: colors.black,
    marginTop: formatSize(8),
    ...typography.numbersMedium17
  }
}));
