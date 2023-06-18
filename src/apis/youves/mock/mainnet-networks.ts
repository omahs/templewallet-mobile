import {
  DexType,
  ExchangePair,
  Farm,
  FarmType,
  Token,
  _3PToken,
  abbusdToken,
  abrToken,
  ageureToken,
  akadaoToken,
  apusdcToken,
  aqrtzToken,
  banToken,
  bartToken,
  bdaoToken,
  bdvxpToken,
  bezosToken,
  btctzToken,
  busdeToken,
  cchfToken,
  cloverToken,
  crdaoToken,
  crnchyToken,
  crunchToken,
  ctezToken,
  ctezcchfLP,
  ctezxtzLP,
  cvzaToken,
  daieToken,
  demnToken,
  dogaToken,
  dripToken,
  easyToken,
  ecnToken,
  elxrToken,
  enrToken,
  ethtzToken,
  eurlToken,
  evilToken,
  fdaoToken,
  flameToken,
  gifToken,
  gonzToken,
  gotToken,
  gsalToken,
  gutsToken,
  hdaoToken,
  hehToken,
  heraToken,
  hrdaoToken,
  idzToken,
  instaToken,
  kalamToken,
  kdaoToken,
  kusdToken,
  linkeToken,
  lyziToken,
  magToken,
  maticeToken,
  mchToken,
  minToken,
  mtriaToken,
  mttrToken,
  myhToken,
  natasToken,
  oxtzToken,
  paulToken,
  pepeToken,
  pepe_kt_61aToken,
  platToken,
  plentyToken,
  plyToken,
  purpleToken,
  pxlToken,
  pxldaoToken,
  quipuToken,
  radioToken,
  rcktToken,
  rsalToken,
  rtqlaToken,
  scasToken,
  sdaoToken,
  sebToken,
  shlToken,
  shtzToken,
  skullToken,
  smakToken,
  soilToken,
  spiToken,
  stkrToken,
  stvToken,
  szoToken,
  tchickenToken,
  tcoinToken,
  tdaoToken,
  tezdaoToken,
  tkeyToken,
  tokensToken,
  trollToken,
  tzbtcLPToken,
  tzbtcToken,
  tzbtcwwbtcLP,
  tzdToken,
  ubtcToken,
  ubtctzbtcLP,
  ubtcwbtceLP,
  udefiToken,
  udefixtzLP,
  unoToken,
  upToken,
  usdce,
  usdsToken,
  usdtToken,
  usdteToken,
  usdtzToken,
  uusdToken,
  uusdkusdLP,
  uusdquipuLP,
  uusdubtcLP,
  uusdudefiLP,
  uusdusdceLP,
  uusdusdtLP,
  uusdusdtzLP,
  uusdwusdcLP,
  uusdxtzLP,
  uusdyouLP,
  uxtzToken,
  uxtzxtzLP,
  waaveToken,
  wbtce,
  wbusdToken,
  wcroToken,
  wdaiToken,
  weedToken,
  wetheToken,
  wethpToken,
  wfttToken,
  wheatToken,
  whusdToken,
  wlinkToken,
  wmaticToken,
  wmaticpToken,
  wpaxToken,
  wrapToken,
  wrcToken,
  wsushiToken,
  wtacoToken,
  wtezToken,
  wtzToken,
  wuniToken,
  wusdc,
  wusdtToken,
  wwbtc,
  wwethToken,
  wxtzToken,
  xtzToken,
  youToken,
  youuxtzLP,
  youxtzLP
} from './network.base';

export const mainnetTokens: Record<string, Token> = {
  xtzToken: { ...xtzToken, contractAddress: 'EMPTY' },
  youToken: { ...youToken, contractAddress: 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL' },
  uusdToken: { ...uusdToken, contractAddress: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW' },
  udefiToken: { ...udefiToken, contractAddress: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW' },
  ubtcToken: { ...ubtcToken, contractAddress: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW' },
  uxtzToken: { ...uxtzToken, contractAddress: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW' },
  tzbtcToken: { ...tzbtcToken, contractAddress: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn' },
  kusdToken: { ...kusdToken, contractAddress: 'KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV' },
  usdtToken: { ...usdtToken, contractAddress: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o' },
  usdtzToken: { ...usdtzToken, contractAddress: 'KT1LN4LPSqTMS7Sd2CJw4bbDGRkMv2t68Fy9' },
  wusdcToken: { ...wusdc, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wwbtcToken: { ...wwbtc, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  usdceToken: { ...usdce, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  wbtceToken: { ...wbtce, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  plentyToken: { ...plentyToken, contractAddress: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b' },
  quipuToken: { ...quipuToken, contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb' },
  ethtzToken: { ...ethtzToken, contractAddress: 'KT19at7rQUvyjxnZ2fBv7D9zc8rkyG7gAoU8' },
  wxtzToken: { ...wxtzToken, contractAddress: 'KT1VYsVfmobT7rsMVivvZ4J8i3bPiqz12NaH' },
  kdaoToken: { ...kdaoToken, contractAddress: 'KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH' },
  smakToken: { ...smakToken, contractAddress: 'KT1TwzD6zV3WeJ39ukuqxcfK2fJCnhvrdN1X' },
  paulToken: { ...paulToken, contractAddress: 'KT19DUSZw7mfeEATrbWVPHRrWNVbNnmfFAE6' },
  dogaToken: { ...dogaToken, contractAddress: 'KT1Ha4yFVeyzw6KRAdkzq6TxDHB97KG4pZe8' },
  usdsToken: { ...usdsToken, contractAddress: 'KT1REEb5VxWRjcHm5GzDMwErMmNFftsE5Gpf' },
  wrapToken: { ...wrapToken, contractAddress: 'KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd' },
  unoToken: { ...unoToken, contractAddress: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF' },
  hdaoToken: { ...hdaoToken, contractAddress: 'KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW' },
  instaToken: { ...instaToken, contractAddress: 'KT19y6R8x53uDKiM46ahgguS6Tjqhdj2rSzZ' },
  crunchToken: { ...crunchToken, contractAddress: 'KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng' },
  flameToken: { ...flameToken, contractAddress: 'KT1Wa8yqRBpFCusJWgcQyjhRz7hUQAmFxW7j' },
  gifToken: { ...gifToken, contractAddress: 'KT1XTxpQvo7oRCqp85LikEZgAZ22uDxhbWJv' },
  kalamToken: { ...kalamToken, contractAddress: 'KT1A5P4ejnLix13jtadsfV9GCnXLMNnab8UT' },
  pxlToken: { ...pxlToken, contractAddress: 'KT1F1mn2jbqQCJcsNgYKVAQjvenecNMY2oPK' },
  crdaoToken: { ...crdaoToken, contractAddress: 'KT1XPFjZqCULSnqfKaaYy8hJjeY63UNSGwXg' },
  wtzToken: { ...wtzToken, contractAddress: 'KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn' },
  wusdtToken: { ...wusdtToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wbusdToken: { ...wbusdToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wpaxToken: { ...wpaxToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wdaiToken: { ...wdaiToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wwethToken: { ...wwethToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wmaticToken: { ...wmaticToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wlinkToken: { ...wlinkToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wuniToken: { ...wuniToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  waaveToken: { ...waaveToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  whusdToken: { ...whusdToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wetheToken: { ...wetheToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  usdteToken: { ...usdteToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  maticeToken: { ...maticeToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  linkeToken: { ...linkeToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  daieToken: { ...daieToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  busdeToken: { ...busdeToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  eurlToken: { ...eurlToken, contractAddress: 'KT1JBNFcB5tiycHNdYGYCtR3kk6JaJysUCi8' },
  ageureToken: { ...ageureToken, contractAddress: 'KT1UsSfaXyqcjSVPeiD7U1bWgKy3taYN7NWY' },
  wrcToken: { ...wrcToken, contractAddress: 'KT19Fmya7B49wKYdoqXYphyQWGRUn9g5wG8R' },
  mttrToken: { ...mttrToken, contractAddress: 'KT1K4jn23GonEmZot3pMGth7unnzZ6EaMVjY' },
  spiToken: { ...spiToken, contractAddress: 'KT1CS2xKGHNPTauSh5Re4qE3N9PCfG5u4dPx' },
  rsalToken: { ...rsalToken, contractAddress: 'KT19ovJhcsUn4YU8Q5L3BGovKSixfbWcecEA' },
  sdaoToken: { ...sdaoToken, contractAddress: 'KT19ovJhcsUn4YU8Q5L3BGovKSixfbWcecEA' },
  btctzToken: { ...btctzToken, contractAddress: 'KT1T87QbpXEVgkwsNPzz8iRoah3SS3D1MDmh' },
  mtriaToken: { ...mtriaToken, contractAddress: 'KT1KRvNVubq64ttPbQarxec5XdS6ZQU4DVD2' },
  demnToken: { ...demnToken, contractAddress: 'KT1GBgCd5dk7v4TSzWvtk1X64TxMyG4r7eRX' },
  minToken: { ...minToken, contractAddress: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF' },
  enrToken: { ...enrToken, contractAddress: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF' },
  mchToken: { ...mchToken, contractAddress: 'KT1ErKVqEhG9jxXgUG2KGLW3bNM7zXHX8SDF' },
  upToken: { ...upToken, contractAddress: 'KT1TgmD7kXQzofpuc9VbTRMdZCS2e6JDuTtc' },
  abrToken: { ...abrToken, contractAddress: 'KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX' },
  abbustToken: { ...abbusdToken, contractAddress: 'KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX' },
  apusdcToken: { ...apusdcToken, contractAddress: 'KT1UG6PdaKoJcc3yD6mkFVfxnS1uJeW3cGeX' },
  wethpToken: { ...wethpToken, contractAddress: 'KT1CNyTPmBJ5hcqDPbPkFtoe76LifXyHUvqc' },
  wmaticpToken: { ...wmaticpToken, contractAddress: 'KT1CNyTPmBJ5hcqDPbPkFtoe76LifXyHUvqc' },
  tchickenToken: { ...tchickenToken, contractAddress: 'KT1QoDjTpkG9jmAMwrPCsaRR78xHDcRKydBp' },
  natasToken: { ...natasToken, contractAddress: 'KT1GaEvbD4zA3pHs7mv3grpuqR1KGtjXAEDe' },
  wtacoToken: { ...wtacoToken, contractAddress: 'KT1WtCq6FuL2kYTK1x7AkmpPjb8wEJZTUwvX' },
  _3PToken: { ..._3PToken, contractAddress: 'KT1CegZeeBZLjvy2oD4gcZwf17ucs4fwvXH8' },
  tcoinToken: { ...tcoinToken, contractAddress: 'KT1GorwGk5WXLUc3sEWrmPLQBSekmYrtz1sn' },
  gsalToken: { ...gsalToken, contractAddress: 'KT1VHd7ysjnvxEzwtjBAmYAmasvVCfPpSkiG' },
  scasToken: { ...scasToken, contractAddress: 'KT1VHd7ysjnvxEzwtjBAmYAmasvVCfPpSkiG' },
  crnchyToken: { ...crnchyToken, contractAddress: 'KT1914CUZ7EegAFPbfgQMRkw8Uz5mYkEz2ui' },
  plyToken: { ...plyToken, contractAddress: 'KT1JVjgXPMMSaa6FkzeJcgb8q9cUaLmwaJUX' },
  tzbtcLP: { ...tzbtcLPToken, contractAddress: 'KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo' },
  uusdwusdcLP: { ...uusdwusdcLP, contractAddress: 'KT1Exm6UTCNEbBHANZ7S53t7QN8NJFwAytxg' },
  tzbtcwwbtcLP: { ...tzbtcwwbtcLP, contractAddress: 'KT1CuqpjqPPvcZCrvzJunCvHvPaujASdmFJZ' },
  ubtctzbtcLP: { ...ubtctzbtcLP, contractAddress: 'KT1TzHdwC4KHbGxsXVVvaxdrjVPgUsrHEgJr' },
  uusdkusdLP: { ...uusdkusdLP, contractAddress: 'KT1NZt7NTYs7m3VhB8rrua7WwVQ9uhKgpgCN' },
  uusdusdtzLP: { ...uusdusdtzLP, contractAddress: 'KT1Toztq42271zT2wXDnu2hFVVdJJ8qWrETu' },
  uusdubtcLP: { ...uusdubtcLP, contractAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi' },
  uusdyouLP: { ...uusdyouLP, contractAddress: 'KT1Tmncfgpp4ZSp6aEogL7uhBqHTiKsSPegK' },
  uusdudefiLP: { ...uusdudefiLP, contractAddress: 'KT1RQvdYD9yc763j8FiVLyXbKPVVbZqGRx5m' },
  uusdxtzLP: { ...uusdxtzLP, contractAddress: 'KT1EtjRRCBC2exyCRXz8UfV7jz7svnkqi7di' },
  youxtzLP: { ...youxtzLP, contractAddress: 'KT1PL1YciLdwMbydt21Ax85iZXXyGSrKT2BE' },
  udefixtzLP: { ...udefixtzLP, contractAddress: 'KT1H8sJY2VzrbiX4pYeUVsoMUd4iGw2DV7XH' },
  uusdquipuLP: { ...uusdquipuLP, contractAddress: 'KT1VNEzpf631BLsdPJjt2ZhgUitR392x6cSi' },
  uusdusdtLP: { ...uusdusdtLP, contractAddress: 'KT1H41VCk8FgskYy4RbLXH8Fwt83PJ5MNvno' },
  uusdusdceLP: { ...uusdusdceLP, contractAddress: 'KT1TQQZN7419ZFYdwgwLeZoW9ikeNfEewjKr' },
  ubtcwbtceLP: { ...ubtcwbtceLP, contractAddress: 'KT1Skvk2hzRm4LZQX56wG96gnFnYsLD4eEoG' },
  uxtzxtzLP: { ...uxtzxtzLP, contractAddress: 'KT1Na3AAgwet8jrqyq9advhDDK7NHAYuVo5j' },
  wcroToken: { ...wcroToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wsushiToken: { ...wsushiToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  wfttToken: { ...wfttToken, contractAddress: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ' },
  skullToken: { ...skullToken, contractAddress: 'KT1BEHqhkuqpBoMKuMZSQNx1fEwWp4dranEH' },
  stvToken: { ...stvToken, contractAddress: 'KT1CxE36bXiCJnLZ9C9z1Ma921qu3ksmeZxc' },
  rtqlaToken: { ...rtqlaToken, contractAddress: 'KT1QHcRL3FZRpQruFkb1GBYwfqoPXTFGipRH' },
  shlToken: { ...shlToken, contractAddress: 'KT1X5okZZpcUvqFZ2r7GA8rRifrSzYrCky8P' },
  wheatToken: { ...wheatToken, contractAddress: 'KT1DgP4K39T1Wqqax9YZuwnkstnY1gNtqcri' },
  akadaoToken: { ...akadaoToken, contractAddress: 'KT1AM3PV1cwmGRw28DVTgsjjsjHvmL6z4rGh' },
  idzToken: { ...idzToken, contractAddress: 'KT1WapdVeFqhCfqwdHWwTzSTX7yXoHgiPRPU' },
  gotToken: { ...gotToken, contractAddress: 'KT1GioMCKwRyWoQpdrwxvsPVEsFJkkLyquVZ' },
  elxrToken: { ...elxrToken, contractAddress: 'KT1BsZVD9rQ67RERns4TEhQ5aav5s6QGa2gL' },
  weedToken: { ...weedToken, contractAddress: 'KT1KEsRsSMvSkgZ9CwYy5fPA1e4j3TEpuiKK' },
  evilToken: { ...evilToken, contractAddress: 'KT1Ava7Qm338ZJj83P1ZhNbGkaRZM8N1FsPD' },
  bartToken: { ...bartToken, contractAddress: 'KT1T3Ly4RkMehwNpC4iWr86EV5D155bTRvce' },
  radioToken: { ...radioToken, contractAddress: 'KT1NSLhBqkWbGnr6PeYwigwKzurRgUF36vas' },
  gutsToken: { ...gutsToken, contractAddress: 'KT1Nbc9cmx19qFrYYFpkiDoojVYL8UZJYVcj' },
  banToken: { ...banToken, contractAddress: 'KT1AhSVv4Se1j3Hf5Y6a56vBV44zNzjP91D2' },
  tdaoToken: { ...tdaoToken, contractAddress: 'KT1Cjx8hYwzaCAke6rLWoZBLp8w89VeAduAR' },
  shtzToken: { ...shtzToken, contractAddress: 'KT19oivKN2qzeWgCs886BbttSVYtkcJHRtuQ' },
  dripToken: { ...dripToken, contractAddress: 'KT1XsmJTskZtrJUUmaz3D7nynaZ28mM8HCez' },
  bezosToken: { ...bezosToken, contractAddress: 'KT1J4m9nxZQSKDwRNahAL1fziuwW9o5hb8Tb' },
  rcktToken: { ...rcktToken, contractAddress: 'KT19JYndHaesXpvUfiwgg8BtE41HKkjjGMRC' },
  bdvxpToken: { ...bdvxpToken, contractAddress: 'KT1T1PeeRDbsKDYM2nX8JjJ1kkAhHh5FnjgC' },
  bdaoToken: { ...bdaoToken, contractAddress: 'KT1GUNKmkrgtMQjJp3XxcmCj6HZBhkUmMbge' },
  hrdaoToken: { ...hrdaoToken, contractAddress: 'KT1ExpspQSag2x5dATrBxEQzrHP5PJd28fA4' },
  ecnToken: { ...ecnToken, contractAddress: 'KT1M81KrJr6TxYLkZkVqcpSTNKGoya8XytWT' },
  purpleToken: { ...purpleToken, contractAddress: 'KT1Trhji1aVzDtGiAxiCfWNi9T74Kyi49DK1' },
  cloverToken: { ...cloverToken, contractAddress: 'KT18jyxMDSMJRPPaZjoe49SUkXxax9QZtcWH' },
  oxtzToken: { ...oxtzToken, contractAddress: 'KT1TjnZYs5CGLbmV6yuW169P8Pnr9BiVwwjz' },
  gonzToken: { ...gonzToken, contractAddress: 'KT1RTsRfBxLf6egtsXrQX1CcXCqKL3XwpuFT' },
  heraToken: { ...heraToken, contractAddress: 'KT1JXxK3bd39ayLiiBdKm2cdReYnVSG3bkzK' },
  platToken: { ...platToken, contractAddress: 'KT1SybeY3QZ3kX4PS5ZXhxyv2dZWghTFuCdu' },
  fdaoToken: { ...fdaoToken, contractAddress: 'KT1KPoyzkj82Sbnafm6pfesZKEhyCpXwQfMc' },
  tezdaoToken: { ...tezdaoToken, contractAddress: 'KT1C9X9s5rpVJGxwVuHEVBLYEdAQ1Qw8QDjH' },
  cvzaToken: { ...cvzaToken, contractAddress: 'KT1BCzAq3PrTKPsEBKuoTGZdwX6rN6WE8rJj' },
  pxldaoToken: { ...pxldaoToken, contractAddress: 'KT1VQG4kZR6FkF8jppegp8cGhjJF66jJejLf' },
  sebToken: { ...sebToken, contractAddress: 'KT1981tPmXh4KrUQKZpQKb55kREX7QGJcF3E' },
  aqrtzToken: { ...aqrtzToken, contractAddress: 'KT19wuExNXayErfuCkcy6Z56cd1FWzF96xXk' },
  tzdToken: { ...tzdToken, contractAddress: 'KT1RhRYoGmhDr4DShdggQqumRAhwAETxrs3t' },
  easyToken: { ...easyToken, contractAddress: 'KT1QgAtLPu3SNq9c6DPLanwL5bvfX3rgh2CS' },
  soilToken: { ...soilToken, contractAddress: 'KT1TtaMcoSx5cZrvaVBWsFoeZ1L15cxo5AEy' },
  myhToken: { ...myhToken, contractAddress: 'KT1BB1uMwVvJ1M3vVHXWALs1RWdgTp1rnXTR' },
  hehToken: { ...hehToken, contractAddress: 'KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9' },
  magToken: { ...magToken, contractAddress: 'KT1H5KJDxuM9DURSfttepebb6Cn7GbvAAT45' },
  szoToken: { ...szoToken, contractAddress: 'KT1WzRVUnrJ4mNu59m9hPQZDY8Nq9JWtUbRf' },
  stkrToken: { ...stkrToken, contractAddress: 'KT1AEfeckNbdEYwaMKkytBwPJPycz7jdSGea' },
  wtezToken: { ...wtezToken, contractAddress: 'KT1UpeXdK6AJbX58GJ92pLZVCucn2DR8Nu4b' },
  cchfToken: { ...cchfToken, contractAddress: 'KT1LrEJsaTR5vMdwjvASTtFPUbk2wnX3P166', tokenId: 0 },
  ctezToken: { ...ctezToken, contractAddress: 'KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4' },
  ctezcchfLP: { ...ctezcchfLP, contractAddress: 'KT1LrEJsaTR5vMdwjvASTtFPUbk2wnX3P166', tokenId: 1 },
  ctezxtzLP: { ...ctezxtzLP, contractAddress: 'KT1MX69KiYtZKNFeKfELyXJrWFhsQGgcuNgh', tokenId: 0 },
  youuxtzLP: { ...youuxtzLP, contractAddress: 'KT1G3w1x3G1V6or8m336Md2Dd96xuGyeaBC5' },
  tkeyToken: { ...tkeyToken, contractAddress: 'KT1WihWRnmzhfebi6zqQ4tvNGiPeVxiGwTi2' },
  pepe_kt_61aToken: { ...pepe_kt_61aToken, contractAddress: 'KT1BcLbfD97Fs2778vsYUTcQ8Hv12nooT61a' },
  pepeToken: { ...pepeToken, contractAddress: 'KT1MZg99PxMDEENwB4Fi64xkqAVh5d1rv8Z9' },
  trollToken: { ...trollToken, contractAddress: 'KT1Vn88tz943W4uKvJ2anSS3JJfeiVdQrqLe' },
  tokensToken: { ...tokensToken, contractAddress: 'KT1Gf5JGXC1M8GMji58pKraXiRLkzW2NRK1s' },
  lyziToken: { ...lyziToken, contractAddress: 'KT1UMx7aZQWNKY9nC4LRYNsueEiGMfpcQhhD' }
};

export const mainnetFarms: Farm[] = [
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.usdtToken,
    lpToken: mainnetTokens.uusdusdtLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1USKq4gHFVs7WJSVsqKn8j8P4tmqZcgSbd',
    expectedWeeklyRewards: 840,
    dexType: DexType.FLAT_CURVE,
    active: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.usdceToken,
    token2: mainnetTokens.uusdToken,
    lpToken: mainnetTokens.uusdusdceLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1CpXvNd293VvHkY7M9krjBvwEFuvura65Q',
    expectedWeeklyRewards: 350,
    dexType: DexType.FLAT_CURVE,
    active: true
  },
  {
    type: FarmType.NO_LOCK,
    token1: mainnetTokens.wusdcToken,
    token2: mainnetTokens.uusdToken,
    lpToken: mainnetTokens.uusdwusdcLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1TkNadQ9Cw5ZNRyS4t9SKmUbmAMkqY8bkV',
    expectedWeeklyRewards: 0,
    dexType: DexType.FLAT_CURVE,
    active: false
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.ubtcToken,
    lpToken: mainnetTokens.uusdubtcLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1KGfEyxBeCU873RfuwrU1gy8sjC1s82WZV',
    expectedWeeklyRewards: 490,
    dexType: DexType.QUIPUSWAP,
    active: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.kusdToken,
    lpToken: mainnetTokens.uusdkusdLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1HaWDWv7XPsZ54JbDquXV6YgyazQr9Jkp3',
    expectedWeeklyRewards: 140,
    dexType: DexType.FLAT_CURVE,
    active: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.usdtzToken,
    lpToken: mainnetTokens.uusdusdtzLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1JFsKh3Wcnd4tKzF6EwugwTVGj3XfGPfeZ',
    expectedWeeklyRewards: 0,
    dexType: DexType.FLAT_CURVE,
    active: false
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.wusdcToken,
    token2: mainnetTokens.uusdToken,
    lpToken: mainnetTokens.uusdwusdcLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1Ug9wWbRuUs1XXRuK11o6syWdTFZQsmvw3',
    expectedWeeklyRewards: 0,
    dexType: DexType.FLAT_CURVE,
    active: false
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.youToken,
    lpToken: mainnetTokens.uusdyouLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1Goz5Dsi8Hf7fqjx5nSEcjp6osD9ufECB2',
    expectedWeeklyRewards: 0,
    dexType: DexType.PLENTY,
    active: false,
    deactivatedNotice: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.udefiToken,
    lpToken: mainnetTokens.uusdudefiLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1W78rDHfwp3CKev7u7dWRJTBqLdwYVcPg9',
    expectedWeeklyRewards: 0,
    dexType: DexType.PLENTY,
    active: false
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.xtzToken,
    lpToken: mainnetTokens.uusdxtzLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1RLGwCgeq2ab92yznQnJinpqy9kG13dFh2',
    expectedWeeklyRewards: 0,
    dexType: DexType.QUIPUSWAP,
    active: false,
    deactivatedNotice: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.youToken,
    token2: mainnetTokens.xtzToken,
    lpToken: mainnetTokens.youxtzLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1M9T11hrSuDXWDqjTUC2iNPCyypA3BsMrm',
    expectedWeeklyRewards: new Date() < new Date('Mar 29 2023 12:00:00 UTC') ? 385 : 0, //TODO
    dexType: DexType.QUIPUSWAP,
    active: new Date() < new Date('Mar 29 2023 12:00:00 UTC'), //TODO
    rewardStart: new Date(1665144000000),
    timeLockNotice: new Date() < new Date('Mar 29 2023 12:00:00 UTC'),
    deactivatedNotice: new Date() > new Date('Mar 29 2023 12:00:00 UTC')
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.quipuToken,
    lpToken: mainnetTokens.uusdquipuLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT18x3gGRMKyhzcBnKYSRrfqjnzu4fPE1Lzy',
    expectedWeeklyRewards: 0,
    dexType: DexType.QUIPUSWAP,
    active: false,
    deactivatedNotice: true
  },
  {
    type: FarmType.INCENTIVISED,
    token1: mainnetTokens.xtzToken,
    token2: mainnetTokens.uxtzToken,
    lpToken: mainnetTokens.uxtzxtzLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1HbzGokeEZ4hu1KRAAw2fyB61RCpBhQXKA',
    expectedWeeklyRewards: 490,
    dexType: DexType.FLAT_CURVE,
    active: true
  },
  {
    type: FarmType.PLENTY,
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.youToken,
    lpToken: mainnetTokens.uusdyouLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1SskdLW3Ayyz7dnLmmjxAyDLxeJ8hm5BXe',
    expectedWeeklyRewards: 0,
    dexType: DexType.PLENTY,
    active: true,
    swapAddress: 'KT1K9hiEmnNyfuwoL2S14YuULUC9E5ciguNN'
  },
  {
    type: FarmType.PLENTY,
    token1: mainnetTokens.uxtzToken,
    token2: mainnetTokens.youToken,
    lpToken: mainnetTokens.youuxtzLP,
    rewardToken: mainnetTokens.youToken,
    farmContract: 'KT1CXqx7Bhsr5yeZNnVPH651edbe6JjZBXB5',
    expectedWeeklyRewards: 0,
    dexType: DexType.PLENTY,
    active: true,
    swapAddress: 'KT1AhdLd9jbUxDf8FfXdMQ7E1KsAmHQJsh9G'
  }
];

export const mainnetDexes: ExchangePair[] = [
  {
    token1: mainnetTokens.usdtToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1UJBvm4hv11Uvu6r4c8zE5K2EfmwiRVgsm',
    liquidityToken: mainnetTokens.uusdusdtLP
  },
  {
    token1: mainnetTokens.usdceToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1NgbaaYhtXh3MwJoYYxrrKUwG3RX5LYVL6',
    liquidityToken: mainnetTokens.uusdusdceLP
  },
  {
    token1: mainnetTokens.wusdcToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1JeWiS8j1kic4PHx7aTnEr9p4xVtJNzk5b',
    liquidityToken: mainnetTokens.uusdwusdcLP
  },
  {
    token1: mainnetTokens.tzbtcToken,
    token2: mainnetTokens.wwbtcToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1T974a8qau4xP3RAAWPYCZM9xtwU9FLjPS',
    liquidityToken: mainnetTokens.tzbtcwwbtcLP
  },
  {
    token1: mainnetTokens.tzbtcToken,
    token2: mainnetTokens.ubtcToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1XvH5f2ja2jzdDbv6rxPmecZFU7s3obquN',
    liquidityToken: mainnetTokens.ubtctzbtcLP
  },
  {
    token1: mainnetTokens.wbtceToken,
    token2: mainnetTokens.ubtcToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1CkpDuwCFrnoqTam6upYiPBiFNsSEVbBei',
    liquidityToken: mainnetTokens.ubtcwbtceLP
  },
  {
    token1: mainnetTokens.kusdToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1AVbWyM8E7DptyBCu4B5J5B7Nswkq7Skc6',
    liquidityToken: mainnetTokens.uusdkusdLP
  },
  {
    token1: mainnetTokens.usdtzToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1Xbx9pykNd38zag4yZvnmdSNBknmCETvQV',
    liquidityToken: mainnetTokens.uusdusdtzLP
  },
  {
    token1: mainnetTokens.xtzToken,
    token2: mainnetTokens.youToken,
    dexType: DexType.QUIPUSWAP,
    address: 'KT1PL1YciLdwMbydt21Ax85iZXXyGSrKT2BE',
    liquidityToken: mainnetTokens.youxtzLP
  },
  {
    token1: mainnetTokens.xtzToken,
    token2: mainnetTokens.uusdToken,
    dexType: DexType.QUIPUSWAP,
    address: 'KT1EtjRRCBC2exyCRXz8UfV7jz7svnkqi7di',
    liquidityToken: mainnetTokens.uusdxtzLP
  },
  {
    token1: mainnetTokens.xtzToken,
    token2: mainnetTokens.udefiToken,
    dexType: DexType.QUIPUSWAP,
    address: 'KT1H8sJY2VzrbiX4pYeUVsoMUd4iGw2DV7XH',
    liquidityToken: mainnetTokens.udefixtzLP
  },
  {
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.youToken,
    dexType: DexType.PLENTY,
    address: 'KT1K9hiEmnNyfuwoL2S14YuULUC9E5ciguNN',
    liquidityToken: mainnetTokens.uusdyouLP
  },
  {
    token1: mainnetTokens.uusdToken,
    token2: mainnetTokens.udefiToken,
    dexType: DexType.PLENTY,
    address: 'KT1EAw8hL5zseB3SLpJhBqPQfP9aWrWh8iMW',
    liquidityToken: mainnetTokens.uusdudefiLP
  },
  {
    token1: mainnetTokens.xtzToken,
    token2: mainnetTokens.uxtzToken,
    dexType: DexType.FLAT_CURVE,
    contractAddress: 'KT1WgguedKZWucrdRKQXaRECEPMZennaVPck',
    liquidityToken: mainnetTokens.uxtzxtzLP
  },
  {
    token1: mainnetTokens.ctezToken,
    token2: mainnetTokens.cchfToken,
    dexType: DexType.CHECKER,
    contractAddress: 'KT1LrEJsaTR5vMdwjvASTtFPUbk2wnX3P166',
    liquidityToken: mainnetTokens.ctezcchfLP
  }
  // {
  //   token1: mainnetTokens.xtzToken,
  //   token2: mainnetTokens.ctezToken,
  //   dexType: DexType.CHECKER, //TODO check this, This is a placeholder, there is no type for ctez swap
  //   contractAddress: 'KT1H5b7LxEExkFd2Tng77TfuWbM5aPvHstPr', //TODO this is in the network constants right now, if ever enabled make sure it is only in one place
  //   liquidityToken: mainnetTokens.ctezxtzLP
  // }
];

export const mainnetUnifiedStakingContractAddress = 'KT1UZcNDxTdkn33Xx5HRkqQoZedc3mEs11yV';
