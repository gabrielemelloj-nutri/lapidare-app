/**
 * Versão atual do app (fork da nutri).
 *
 * É lida do version.json da RAIZ do repo — assim a versão fica em UM lugar só
 * e é a mesma que o UpdateBanner busca remotamente no repo oficial pra comparar.
 *
 * Quando o Lapidare oficial sair uma versão nova, a nutri faz Sync Fork:
 *   - version.json dela atualiza
 *   - Esta constante reflete o valor novo
 *   - Rodapé mostra a nova versão
 *   - O UpdateBanner some (pois local == remoto)
 */
import data from '../version.json';
export const APP_VERSION = data.version;
export const APP_RELEASED_AT = data.released_at;

/** URL do version.json no repo oficial — usado pra detectar updates. */
export const REMOTE_VERSION_URL =
  'https://raw.githubusercontent.com/danielasoares-rd/lapidare-app/main/version.json';
