import { useEffect, useState } from 'react';
import { APP_VERSION, REMOTE_VERSION_URL } from '../version.js';

/**
 * Compara semvers tipo "1.10.0" — retorna >0 se a > b, <0 se a < b, 0 se igual.
 * Aceita formatos "1.10", "v1.10.0", etc.
 */
function compararVersao(a, b) {
  const parse = v => String(v).replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
  const [a1, a2, a3] = parse(a);
  const [b1, b2, b3] = parse(b);
  if (a1 !== b1) return a1 - b1;
  if (a2 !== b2) return a2 - b2;
  return (a3 || 0) - (b3 || 0);
}

/**
 * Banner amarelo no topo da tela que avisa quando há versão nova disponível.
 *
 * Como funciona:
 *  1. Busca version.json do repo oficial (danielasoares-rd/lapidare-app)
 *  2. Compara com APP_VERSION local (do fork da nutri)
 *  3. Só mostra se a remota for MAIOR que a local (compararVersao > 0)
 *
 * Cache de 1h em localStorage pra não bater no GitHub a cada navegação.
 * Cache invalida automaticamente se a APP_VERSION local mudou desde a
 * última checagem (pra resolver o caso "atualizei e cache ainda tá vencido").
 * Falha silenciosamente — se offline ou GitHub fora, app continua normal.
 *
 * Renderizado dentro do NutriLayout — só nutri vê.
 */
export default function UpdateBanner() {
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    async function checkVersion() {
      // Já dismissada nesta sessão?
      if (sessionStorage.getItem('update-banner-dismissed') === APP_VERSION) {
        setDismissed(true);
        return;
      }

      // Cache de 1h — também invalida se APP_VERSION local mudou
      // (pra resolver o caso "fiz update mas o cache antigo ainda diz que tem update")
      try {
        const cached = localStorage.getItem('lapidare-remote-version');
        if (cached) {
          const { version, checkedAt, localAtTime } = JSON.parse(cached);
          const idadeHoras = (Date.now() - checkedAt) / (1000 * 60 * 60);
          const localMudou = localAtTime !== APP_VERSION;
          if (idadeHoras < 1 && !localMudou) {
            if (compararVersao(version, APP_VERSION) > 0) setRemoteVersion(version);
            return;
          }
        }
      } catch { /* localStorage indisponível: ignora */ }

      try {
        const r = await fetch(REMOTE_VERSION_URL, { cache: 'no-store' });
        if (!r.ok) return;
        const data = await r.json();
        try {
          localStorage.setItem('lapidare-remote-version', JSON.stringify({
            version: data.version,
            checkedAt: Date.now(),
            localAtTime: APP_VERSION,
          }));
        } catch { /* ignora */ }
        // Só mostra se a remota for ESTRITAMENTE MAIOR que a local
        if (data.version && compararVersao(data.version, APP_VERSION) > 0) {
          setRemoteVersion(data.version);
        }
      } catch { /* falha silenciosa (offline, github fora, etc) */ }
    }
    checkVersion();
  }, []);

  function dismiss() {
    setDismissed(true);
    try { sessionStorage.setItem('update-banner-dismissed', APP_VERSION); } catch {}
  }

  if (dismissed || !remoteVersion) return null;

  return (
    <>
      <div style={{
        background: '#fff7e0',
        borderBottom: '1px solid #f0c75e',
        color: '#5a4400',
        padding: '10px 16px',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 16 }} aria-hidden="true">🔔</span>
        <span style={{ flex: 1, minWidth: 200 }}>
          Nova versão do Lapidare disponível:{' '}
          <strong>v{remoteVersion}</strong>
          {' '}(você está em v{APP_VERSION}).
        </span>
        <button
          onClick={() => setShowHelp(true)}
          style={{
            background: '#5a4400',
            color: '#fff7e0',
            border: 'none',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
          Como atualizar
        </button>
        <button
          onClick={dismiss}
          aria-label="Fechar"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#5a4400',
            fontSize: 18,
            cursor: 'pointer',
            padding: '0 4px',
            lineHeight: 1,
          }}>×</button>
      </div>

      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 12, padding: 24, maxWidth: 560,
              width: '100%', maxHeight: '90vh', overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 18 }}>
              Como atualizar pra v{remoteVersion}
            </h3>

            <ol style={{ paddingLeft: 20, fontSize: 14, lineHeight: 1.6, color: '#333' }}>
              <li style={{ marginBottom: 10 }}>
                Acesse o seu fork no GitHub:{' '}
                <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                  github.com/SEU-USUARIO/lapidare-app
                </code>
              </li>
              <li style={{ marginBottom: 10 }}>
                Clica no botão <strong>Sync fork</strong> (no topo) → <strong>Update branch</strong>
              </li>
              <li style={{ marginBottom: 10 }}>
                Aguarde ~3 min — o Netlify vai redeployar automaticamente
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Importante:</strong> abra o Supabase e rode o <code>setup.sql</code> atualizado de novo
                {' '}(é seguro, ele é idempotente — não duplica nem apaga dados)
              </li>
              <li style={{ marginBottom: 10 }}>
                Volte aqui e dê <strong>Ctrl+Shift+R</strong> (Windows) ou <strong>Cmd+Shift+R</strong> (Mac)
                pra forçar o navegador a baixar a versão nova
              </li>
            </ol>

            <div style={{
              background: '#fff7e0', border: '1px solid #f0c75e',
              padding: 10, borderRadius: 8, fontSize: 12, marginTop: 14, color: '#5a4400',
            }}>
              <strong>⚠️ Se der conflito no Sync Fork</strong> (ou você notar que itens
              do menu sumiram após atualizar): seu fork tem edições locais que conflitam
              com o oficial. Chame a Daniela para resolver.
            </div>

            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: 14, width: '100%',
                background: '#5a4400', color: 'white', border: 'none',
                padding: '10px 16px', borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}
