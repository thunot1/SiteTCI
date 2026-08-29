// MODULE PAIEMENTS
// ══════════════════════════════════════════════════════════════

// Dynamic from db.typesPaiement
function getPayModes() { return (db.typesPaiement||[]).map(function(t){return t.libelle;}); }
function getPayModesAuto() { return (db.typesPaiement||[]).filter(function(t){return t.mode==='Automatique';}).map(function(t){return t.libelle;}); }
// Fallback constants
var PAY_MODES = ['Carte bancaire','Chèque','Espèces','PayAsso','Coupon sport','Chèque vacances','Virement'];
var PAY_MODES_AUTO = ['Carte bancaire','PayAsso','Virement'];
var paySortCol = 'nom', paySortDir = 1;
var paySelected = {};
var adhSelected = {};

function toggleAdhSel(id, checked) {
  adhSelected[id] = checked;
  var n = Object.keys(adhSelected).filter(function(k){return adhSelected[k];}).length;
  var el = document.getElementById('adhSelCount');
  if (el) el.textContent = n + ' sélectionné(s)';
  // Sync checkbox "tout sélectionner"
  var allCb = document.getElementById('adhSelectAll');
  if (allCb) {
    var rows = document.querySelectorAll('#adherentsTable input[type=checkbox]');
    var total = rows.length;
    allCb.indeterminate = n > 0 && n < total;
    allCb.checked = total > 0 && n === total;
  }
}

function toggleSelectAllAdh(checked) {
  var rows = document.querySelectorAll('#adherentsTable input[type=checkbox]');
  rows.forEach(function(cb) {
    var id = cb.dataset.adhid;
    if (id) { adhSelected[id] = checked; cb.checked = checked; }
  });
  var n = Object.keys(adhSelected).filter(function(k){return adhSelected[k];}).length;
  var el = document.getElementById('adhSelCount');
  if (el) el.textContent = n + ' sélectionné(s)';
}

function openMailGroupeAdh() {
  var selectedIds = Object.keys(adhSelected).filter(function(k){return adhSelected[k];});
  var adherents = selectedIds.length
    ? selectedIds.map(function(id){return db.adherents.find(function(a){return a.id===id;});}).filter(Boolean)
    : (db.adherents||[]).filter(function(a){return !a.saison||a.saison===currentSaison();});
  if (!adherents.length) { toast('Aucun adhérent sélectionné','error'); return; }

  var tpls = (db.mailTemplates||[]);
  var tplOpts = tpls.length
    ? tpls.map(function(t){return '<option value="'+t.id+'">'+escHtml(t.name||t.subject||'')+'</option>';}).join('')
    : '';

  var body =
    '<div style="margin-bottom:14px;font-size:13px;background:var(--bg);border-radius:var(--radius);padding:10px 14px">' +
      '<strong>' + adherents.length + ' adhérent(s)</strong> destinataire(s). ' +
      (selectedIds.length ? '' : '<span style="color:var(--gray)">(aucune sélection = tous les adhérents de la saison)</span>') +
    '</div>' +
    (tpls.length ?
      '<div class="field" style="margin-bottom:12px"><label>Charger un modèle</label>' +
      '<select id="mailgrp_tpl" onchange="mailGroupeApplyTpl()" style="font-size:13px">' +
      '<option value="">— Choisir un modèle —</option>' + tplOpts +
      '</select></div>' : '') +
    '<div class="field" style="margin-bottom:12px"><label>Objet *</label>' +
    '<input type="text" id="mailgrp_objet" placeholder="Objet de l\'e-mail…"></div>' +
    '<div class="field" style="margin-bottom:8px"><label>Message *</label>' +
    '<div style="display:flex;flex-wrap:wrap;gap:3px;padding:5px 8px;background:var(--bg);border:1px solid var(--bg3);border-bottom:none;border-radius:8px 8px 0 0;align-items:center">' +
      '<button type="button" title="Gras" onclick="execMailCmdGrp(\'bold\')" style="width:26px;height:26px;border:1px solid var(--bg3);border-radius:4px;background:#fff;font-weight:700;font-size:12px;cursor:pointer;padding:0">G</button>' +
      '<button type="button" title="Italique" onclick="execMailCmdGrp(\'italic\')" style="width:26px;height:26px;border:1px solid var(--bg3);border-radius:4px;background:#fff;font-style:italic;font-size:12px;cursor:pointer;padding:0">I</button>' +
      '<button type="button" title="Souligné" onclick="execMailCmdGrp(\'underline\')" style="width:26px;height:26px;border:1px solid var(--bg3);border-radius:4px;background:#fff;text-decoration:underline;font-size:12px;cursor:pointer;padding:0">S</button>' +
      '<div style="width:1px;height:20px;background:var(--bg3);margin:0 2px"></div>' +
      '<label title="Couleur du texte" style="display:flex;align-items:center;gap:2px;cursor:pointer"><span style="font-size:12px;font-weight:700;border-bottom:3px solid #C8201A;line-height:1.1;user-select:none">A</span><input type="color" value="#C8201A" onchange="execMailCmdGrp(\'foreColor\',this.value)" style="width:20px;height:20px;border:1px solid var(--bg3);border-radius:3px;padding:1px;cursor:pointer"></label>' +
      '<div style="width:1px;height:20px;background:var(--bg3);margin:0 2px"></div>' +
      '<select onchange="insertMailVarGrpFromSel(this)" style="height:26px;font-size:11px;border:1px solid var(--bg3);border-radius:4px;background:#fff;cursor:pointer;padding:0 4px">' +
        '<option value="">+ Variable…</option>' +
        '<option value="prenom">Prénom</option><option value="nom">Nom</option><option value="prenom_nom">Prénom + Nom</option>' +
        '<option value="reste">Reste à payer</option><option value="montant">Montant total</option><option value="verse">Versé</option>' +
        '<option value="saison">Saison</option><option value="niveau">Niveau</option><option value="groupe">Groupe</option>' +
        '<option value="typecours">Cours</option><option value="enseignant">Enseignant</option>' +
        '<option value="cours_liste">Liste des cours (détail)</option><option value="groupes_liste">Liste des groupes</option>' +
        '<option value="club">Nom du club</option><option value="date_du_jour">Date du jour</option>' +
      '</select>' +
    '</div>' +
    '<div id="mailgrp_corps" contenteditable="true" spellcheck="true" style="min-height:160px;max-height:320px;overflow-y:auto;border:1px solid var(--bg3);border-radius:0 0 8px 8px;padding:10px 12px;font-size:13px;line-height:1.6;outline:none;background:#fff"></div></div>' +
    '<div style="font-size:11px;color:var(--gray);margin-top:4px">La mise en forme du modèle est préservée. Variables : <code>{{prenom}}</code> <code>{{reste}}</code> <code>{{montant}}</code>…</div>';

  openModal('<i class="ti ti-mail" aria-hidden="true"></i> Mail groupé — ' + adherents.length + ' adhérent(s)', body, [
    {label:'Annuler', cls:'btn-secondary', action:'closeModal()'},
    {label:'Générer les emails', cls:'btn-primary', action:'genererMailGroupeAdh()'}
  ]);
  window._mailGrpAdherents = adherents;
}

function mailGroupeApplyTpl() {
  var sel = document.getElementById('mailgrp_tpl');
  if (!sel || !sel.value) return;
  var t = (db.mailTemplates||[]).find(function(x){return x.id===sel.value;});
  if (!t) return;
  var obj = document.getElementById('mailgrp_objet');
  var corps = document.getElementById('mailgrp_corps');
  if (obj) obj.value = t.subject || '';
  if (corps) corps.innerHTML = typeof mailBodyFromStr === 'function' ? mailBodyFromStr(t.body||'') : (t.body||'');
}

function execMailCmdGrp(cmd, val) {
  var el = document.getElementById('mailgrp_corps');
  if (el) el.focus();
  document.execCommand(cmd, false, val !== undefined ? val : null);
}

function insertMailVarGrpFromSel(sel) {
  var key = sel.value;
  if (!key) return;
  sel.selectedIndex = 0;
  var el = document.getElementById('mailgrp_corps');
  if (el) { el.focus(); document.execCommand('insertHTML', false, '{{'+key+'}}'); }
}

function genererMailGroupeAdh() {
  var objet = (document.getElementById('mailgrp_objet')||{}).value || '';
  var corpsEl = document.getElementById('mailgrp_corps');
  var corps = corpsEl ? corpsEl.innerHTML : '';
  var corpsTxt = corpsEl ? (corpsEl.textContent||'').trim() : '';
  if (!objet) { toast('Objet obligatoire','error'); return; }
  if (!corpsTxt) { toast('Message vide','error'); return; }
  var adherents = window._mailGrpAdherents || [];

  // Vérifier si SMTP configuré
  var smtpOk = db.params && db.params.emailFrom && db.params.emailPassword;

  var avecEmail  = adherents.filter(function(a){ return !!a.email; });
  var sansEmail  = adherents.filter(function(a){ return !a.email; });

  if (!avecEmail.length) {
    toast('Aucun adhérent sélectionné n\'a d\'adresse email', 'error');
    return;
  }

  closeModal();

  if (smtpOk) {
    // ── Envoi réel via SMTP ──
    var sent = 0, errors = 0;
    var total = avecEmail.length;
    toast('Envoi en cours… (0/' + total + ')', 'success');

    var sendNext = function(i) {
      if (i >= avecEmail.length) {
        // Plus de scheduleSave ici : l'historique est écrit par logMailHistory(),
        // et rien d'autre n'a changé — inutile de réécrire toute la base.
        toast(sent + ' email(s) envoyé(s) !' + (errors ? ' · ' + errors + ' erreur(s)' : ''), sent > 0 ? 'success' : 'error');
        if (sansEmail.length) toast(sansEmail.length + ' adhérent(s) sans email ignoré(s)', 'error');
        return;
      }
      var a = avecEmail[i];
      var fusionData = typeof docGetFusionData === 'function' ? docGetFusionData(a.id) : {};
      var msg = typeof docFuse === 'function' ? docFuse(corps, fusionData) : corps;

      fetch(API + '/mail/send', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({to: a.email, toName: (a.prenom||'')+' '+(a.nom||''), subject: objet, body: msg, isHtml: true})
      }).then(function(r){ return r.json(); }).then(function(resp) {
        if (resp.ok) {
          sent++;
          logMailHistory({date: new Date().toISOString().split('T')[0], destinataire: a.email, objet: objet, statut: 'Envoyé'});
        } else {
          errors++;
          console.warn('[mail]', a.email, resp.error);
        }
        sendNext(i + 1);
      }).catch(function() { errors++; sendNext(i + 1); });
    };
    sendNext(0);

  } else {
    // ── Fallback mailto (SMTP non configuré) ──
    var ok = 0;
    avecEmail.forEach(function(a) {
      var fusionData = typeof docGetFusionData === 'function' ? docGetFusionData(a.id) : {};
      var msg = typeof docFuse === 'function' ? docFuse(corps, fusionData) : corps;
      var msgText = msg.replace(/<[^>]+>/g, '');
      window.open('mailto:' + a.email + '?subject=' + encodeURIComponent(objet) + '&body=' + encodeURIComponent(msgText));
      logMailHistory({date: new Date().toISOString().split('T')[0], destinataire: a.email, objet: objet, statut: 'Généré (mailto)'});
      ok++;
    });
    toast(ok + ' email(s) ouverts dans votre client mail. Configurez le SMTP Gmail dans Paramètres → Admin → Email pour l\'envoi automatique.', 'success');
    if (sansEmail.length) toast(sansEmail.length + ' adhérent(s) sans email ignoré(s)', 'error');
  }
}

// Calculs pour un adhérent
// Pour un chef de famille, le montant inclut les cotisations de tous les membres rattachés.
// Les membres rattachés n'ont pas de paiements propres (bloqués).
function payCalc(a) {
  var montant = parseFloat(a.montant || 0);
  var paiements = a.paiements || [];
  var verse = paiements.reduce(function(s,p){ return s + (parseFloat(p.montant)||0); }, 0);
  // Fallback: si pas de tableau paiements, utiliser a.verse
  if (!paiements.length && a.verse) verse = parseFloat(a.verse)||0;

  // Si chef de famille : ajouter les montants des membres rattachés
  if (a.famille_lien === 'chef' && db && db.adherents) {
    var membres = db.adherents.filter(function(x){ return x.chef_famille === a.id; });
    membres.forEach(function(m) {
      montant += parseFloat(m.montant || 0);
    });
  }

  var reste = montant - verse;
  var statut = reste <= 0 && montant > 0 ? 'Soldé' : verse > 0 ? 'Partiel' : 'Impayé';
  return { montant: montant, verse: verse, reste: reste, statut: statut };
}

// Vérifie si un adhérent est membre rattaché (non-chef) d'une famille
function isMembreFamille(a) {
  return a.chef_famille && a.chef_famille !== '' && a.famille_lien !== 'chef';
}

function payStatBadge(statut) {
  if (statut === 'Soldé') return '<span class="badge badge-success"><i class="ti ti-circle-check" aria-hidden="true"></i> Soldé</span>';
  if (statut === 'Partiel') return '<span class="badge badge-warn"><i class="ti ti-circle-half" aria-hidden="true"></i> Partiel</span>';
  return '<span class="badge badge-danger"><i class="ti ti-circle-x" aria-hidden="true"></i> Non réglé</span>';
}

function initPaiements() {
  // Migrer anciens paiements (champ verse) vers tableau paiements
  (db.adherents||[]).forEach(function(a) {
    if (!a.paiements) a.paiements = [];
    if (a.verse && parseFloat(a.verse) > 0 && a.paiements.length === 0) {
      a.paiements.push({
        id: 'p_mig_' + a.id,
        type: a.modepay || 'Chèque',
        dateReception: '',
        datePaiement: '',
        montant: parseFloat(a.verse)
      });
    }
  });
  renderPayKPI();
  renderPaiements();
}

function renderPayKPI() {
  var el = document.getElementById('pay-kpi'); if (!el) return;
  var total = 0, verse = 0, soldes = 0, partiels = 0, impayes = 0;
  // Exclure les membres rattachés pour éviter le double-comptage
  // (leur montant est déjà inclus dans le calcul du chef)
  (db.adherents||[]).filter(function(a){return !a.saison||a.saison===currentSaison();}).forEach(function(a) {
    if (isMembreFamille(a)) return; // ignoré : comptabilisé via le chef
    var c = payCalc(a);
    total += c.montant; verse += c.verse;
    if (c.statut === 'Soldé') soldes++;
    else if (c.statut === 'Partiel') partiels++;
    else if (c.montant > 0) impayes++;
  });
  var reste = total - verse;
  el.innerHTML =
    '<div class="kpi-card vert"><div class="kpi-label">Total encaissé</div><div class="kpi-value" style="font-size:20px;color:var(--success)">' + verse.toFixed(2) + ' €</div><div class="kpi-sub">' + soldes + ' soldés</div></div>' +
    '<div class="kpi-card rouge"><div class="kpi-label">Reste à encaisser</div><div class="kpi-value" style="font-size:20px;color:var(--danger)">' + reste.toFixed(2) + ' €</div><div class="kpi-sub">' + (partiels+impayes) + ' en attente</div></div>' +
    '<div class="kpi-card bleu"><div class="kpi-label">Total à régler</div><div class="kpi-value" style="font-size:20px">' + total.toFixed(2) + ' €</div></div>' +
    '<div class="kpi-card orange"><div class="kpi-label">Répartition</div><div style="font-size:12px;margin-top:6px;display:flex;flex-direction:column;gap:3px">' +
    '<div><i class="ti ti-circle-check" aria-hidden="true"></i> Soldés : <strong>' + soldes + '</strong></div>' +
    '<div><i class="ti ti-circle-half" aria-hidden="true"></i> Partiels : <strong>' + partiels + '</strong></div>' +
    '<div><i class="ti ti-circle-x" aria-hidden="true"></i> Non réglés : <strong>' + impayes + '</strong></div></div></div>';
}

// ID de la ligne actuellement dépliée
var _payOpenId = null;

function renderPaiements() {
  var q = (document.getElementById('paySearch')||{}).value||'';
  var statut = (document.getElementById('payStatut')||{}).value||'';
  var mode = (document.getElementById('payMode')||{}).value||'';
  var reste = (document.getElementById('payReste')||{}).value||'';

  var list = (db.adherents||[]).filter(function(a){return !a.saison||a.saison===currentSaison();}).filter(function(a) {
    // Les membres rattachés à un chef ne participent pas aux filtres financiers
    if (isMembreFamille(a)) {
      if (q && !(a.nom+' '+a.prenom).toLowerCase().includes(q.toLowerCase())) return false;
      if (statut) return false;   // pas de statut propre → exclus des filtres statut
      if (mode) return false;     // pas de paiements propres → exclus du filtre mode
      if (reste) return false;    // pas de reste propre → exclus du filtre reste
      return true;
    }
    var c = payCalc(a);
    if (q && !(a.nom+' '+a.prenom).toLowerCase().includes(q.toLowerCase())) return false;
    if (statut && c.statut !== statut) return false;
    if (mode) {
      var modes = (a.paiements||[]).map(function(p){return p.type;});
      if (modes.indexOf(mode) < 0) return false;
    }
    if (reste === '1' && c.reste <= 0) return false;
    if (reste === '0' && c.reste > 0) return false;
    return true;
  });

  list.sort(function(a, b) {
    var ca = payCalc(a), cb = payCalc(b);
    var dir = paySortDir;
    if (paySortCol === 'nom') return dir * (a.nom + a.prenom).localeCompare(b.nom + b.prenom);
    if (paySortCol === 'montant') return dir * (ca.montant - cb.montant);
    if (paySortCol === 'reste') return dir * (ca.reste - cb.reste);
    return 0;
  });

  var tbody = document.getElementById('paiementsTable');
  if (!tbody) return;

  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--gray);padding:32px">Aucun adhérent trouvé</td></tr>';
    return;
  }

  var rows = '';
  list.forEach(function(a) {
    var isMembre = isMembreFamille(a);
    var c = isMembre ? {montant:0, verse:0, reste:0, statut:''} : payCalc(a);
    var isOpen = _payOpenId === a.id;

    var modes = (function(){
      if (isMembre) return '';
      var seen = {};
      return (a.paiements||[]).map(function(p){return p.type;}).filter(function(m){
        if(seen[m])return false; seen[m]=true; return true;
      }).map(function(m){
        var _tp=(db.typesPaiement||[]).find(function(tp){return tp.libelle===m;});
        var _c=_tp?_tp.couleur:'#636366';
        return '<span style="display:inline-block;padding:1px 7px;border-radius:10px;font-size:10px;font-weight:600;background:'+_c+'20;color:'+_c+'">'+m+'</span>';
      }).join(' ');
    })();

    var sel = paySelected[a.id] ? ' checked' : '';
    var rowBg = isOpen ? 'background:rgba(200,32,26,0.04)' :
      isMembre ? 'background:rgba(37,99,235,0.02)' :
      c.statut==='Soldé' ? 'background:rgba(22,163,74,0.03)' :
      c.statut==='Partiel' ? 'background:rgba(217,119,6,0.04)' :
      c.montant>0 ? 'background:rgba(220,38,38,0.03)' : '';
    var progPct = c.montant > 0 ? Math.min(100,Math.round(c.verse/c.montant*100)) : 0;
    var progColor = progPct>=100?'var(--success)':progPct>0?'var(--warn)':'var(--danger)';

    // Cellules montant/versé/reste : vides pour les membres rattachés
    var tdMontant = isMembre ? '<td style="padding:10px;text-align:right;color:var(--bg3)">—</td>' :
      '<td style="text-align:right;font-weight:600;padding:10px">'+(c.montant>0?c.montant.toFixed(2)+' €':'—')+'</td>';
    var tdVerse   = isMembre ? '<td style="padding:10px;text-align:right;color:var(--bg3)">—</td>' :
      '<td style="text-align:right;color:var(--success);font-weight:600;padding:10px">'+(c.verse>0?c.verse.toFixed(2)+' €':'—')+'</td>';
    var tdReste   = isMembre ? '<td style="padding:10px;text-align:right;color:var(--bg3)">—</td>' :
      '<td style="text-align:right;font-weight:700;padding:10px;color:'+(c.reste>0?'var(--danger)':'var(--success)')+'">'+
        (c.montant>0?c.reste.toFixed(2)+' €':'—')+'</td>';
    var tdStatut  = isMembre ? '<td style="padding:10px"></td>' :
      '<td style="padding:10px">'+payStatBadge(c.statut)+'</td>';

    // Ligne principale
    rows += '<tr style="'+rowBg+';cursor:pointer;border-bottom:'+(isOpen?'none':'1px solid var(--bg3)')+'" data-adid="'+a.id+'" onclick="togglePayRow(this.dataset.adid)">' +
      '<td onclick="event.stopPropagation()" style="padding:10px 8px 10px 12px">' +
        '<input type="checkbox" '+sel+' data-adid2="'+a.id+'" onchange="togglePaySel(this.dataset.adid2,this.checked)" style="width:14px;height:14px">' +
      '</td>' +
      '<td style="padding:10px 6px;color:var(--gray);font-size:13px;width:20px">' +
        '<span style="display:inline-block;transition:transform 0.2s;transform:'+(isOpen?'rotate(90deg)':'rotate(0deg)')+'">▶</span>' +
      '</td>' +
      '<td style="padding:10px 10px">' +
        '<div style="font-weight:600">'+a.nom+' '+a.prenom+'</div>' +
        (a.catage?'<div style="font-size:11px;color:var(--gray)">'+a.catage+'</div>':'') +
      '</td>' +
      '<td style="padding:10px;font-size:12px;color:var(--gray)">'+(a.formule_label||'—')+'</td>' +
      tdMontant + tdVerse + tdReste +
      '<td style="padding:10px">'+(isMembre ? '' : (modes||'—'))+'</td>' +
      tdStatut +
      '<td style="padding:10px" onclick="event.stopPropagation()">' +
        (isMembre
          ? (function(){ var chef=db.adherents.find(function(x){return x.id===a.chef_famille;}); return '<span style="font-size:11px;color:#1d4ed8;background:rgba(37,99,235,0.08);border-radius:12px;padding:3px 9px;white-space:nowrap;display:inline-block"><i class="ti ti-crown" aria-hidden="true"></i> '+(chef?chef.prenom+' '+chef.nom:'Chef famille')+'</span>'; })()
          : '<button class="btn btn-primary btn-sm" data-adid3="'+a.id+'" onclick="openAddPaiement(this.dataset.adid3)">+ Payer</button>') +
      '</td>' +
    '</tr>';

    // Ligne de détail dépliable
    rows += '<tr id="pay-detail-row-'+a.id+'" style="display:'+(isOpen?'table-row':'none')+';background:var(--bg)">' +
      '<td colspan="10" style="padding:0;border-bottom:2px solid var(--red)">' +
        buildPayDetailRow(a, c, progPct, progColor) +
      '</td>' +
    '</tr>';
  });

  tbody.innerHTML = rows;
  renderPayKPI();
  document.getElementById('paySelCount').textContent = Object.keys(paySelected).filter(function(k){return paySelected[k];}).length + ' sélectionné(s)';
}

function buildPayDetailRow(a, c, progPct, progColor) {
  // Trier les paiements par ordre chronologique décroissant
  var paiements = (a.paiements||[]).slice().sort(function(x,y){
    var dx = x.dateReception||x.datePaiement||'';
    var dy = y.dateReception||y.datePaiement||'';
    return dy.localeCompare(dx); // décroissant
  });

  var html = '<div style="padding:16px 20px 20px 54px">';

  // Barre synthèse + progression
  html += '<div style="display:flex;align-items:center;gap:20px;margin-bottom:14px;flex-wrap:wrap">';
  html += '<div style="display:flex;gap:12px">';
  html += '<div style="text-align:center;padding:8px 14px;background:var(--bg2);border-radius:var(--radius);min-width:80px">' +
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:2px">À régler</div>' +
    '<div style="font-size:16px;font-weight:800">'+c.montant.toFixed(2)+' €</div></div>';
  html += '<div style="text-align:center;padding:8px 14px;background:rgba(22,163,74,0.07);border-radius:var(--radius);min-width:80px">' +
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:2px">Réglé</div>' +
    '<div style="font-size:16px;font-weight:800;color:var(--success)">'+c.verse.toFixed(2)+' €</div></div>';
  html += '<div style="text-align:center;padding:8px 14px;background:rgba('+(c.reste>0?'220,38,38':'22,163,74')+',0.07);border-radius:var(--radius);min-width:80px">' +
    '<div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:2px">Reste</div>' +
    '<div style="font-size:16px;font-weight:800;color:'+(c.reste>0?'var(--danger)':'var(--success)')+'">'+c.reste.toFixed(2)+' €</div></div>';
  html += '</div>';
  // Progression
  html += '<div style="flex:1;min-width:140px">' +
    '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--gray);margin-bottom:4px"><span>Progression</span><span>'+progPct+'%</span></div>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:'+progPct+'%;background:'+progColor+'"></div></div>' +
    '</div>';
  if (c.verse > c.montant && c.montant > 0) html += '<span class="badge badge-warn"><i class="ti ti-alert-triangle" aria-hidden="true"></i> Trop-perçu</span>';
  html += '</div>';

  // Cas membre rattaché : bloquer tout ajout de paiement
  if (isMembreFamille(a)) {
    var chef = db.adherents.find(function(x){ return x.id === a.chef_famille; });
    html += '<div style="background:rgba(37,99,235,0.06);border:1px solid rgba(37,99,235,0.2);border-radius:8px;padding:12px 16px;font-size:13px;color:#1d4ed8;margin-top:8px">' +
      '<i class="ti ti-crown" aria-hidden="true"></i> Les paiements de cet adhérent sont gérés par le chef de famille : ' +
      '<strong>' + (chef ? chef.prenom + ' ' + chef.nom : 'Chef famille') + '</strong>. ' +
      '<span style="color:var(--gray)">Rendez-vous sur sa fiche pour enregistrer un paiement.</span>' +
      (chef ? ' <button class="btn btn-secondary btn-sm" style="margin-left:8px" onclick="ouvrirFicheExistante(\''+chef.id+'\')">Ouvrir la fiche</button>' : '') +
    '</div>';
    html += '</div>';
    return html;
  }

  // Tableau des paiements
  if (!paiements.length) {
    html += '<div style="font-size:13px;color:var(--gray);font-style:italic;padding:8px 0 4px">Aucun paiement enregistré.</div>';
  } else {
    html += '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px">';
    html += '<thead><tr style="border-bottom:1px solid var(--bg3)">' +
      '<th style="text-align:left;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Date réception</th>' +
      '<th style="text-align:left;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Date paiement</th>' +
      '<th style="text-align:left;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Mode</th>' +
      '<th style="text-align:left;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Référence</th>' +
      '<th style="text-align:left;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Échéance</th>' +
      '<th style="text-align:right;padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--gray)">Montant</th>' +
      '<th style="width:80px"></th>' +
    '</tr></thead><tbody>';
    paiements.forEach(function(p, idx) {
      var tpInfo = (db.typesPaiement||[]).find(function(tp){return tp.libelle===p.type;});
      var tpColor = tpInfo ? tpInfo.couleur : '#636366';
      var rowBg = idx%2===0?'':'background:rgba(0,0,0,0.015)';
      html += '<tr style="'+rowBg+'">' +
        '<td style="padding:7px 10px;color:var(--gray)">'+(fmtDate(p.dateReception)||'—')+'</td>' +
        '<td style="padding:7px 10px;color:var(--gray)">'+(fmtDate(p.datePaiement)||'—')+'</td>' +
        '<td style="padding:7px 10px">' +
          '<span style="display:inline-block;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;background:'+tpColor+'20;color:'+tpColor+';border:1px solid '+tpColor+'30">'+(p.type||'—')+'</span>' +
        '</td>' +
        '<td style="padding:7px 10px;font-size:12px;color:var(--dark)">'+(p.reference?escHtml(p.reference):'<span style="color:var(--gray)">—</span>')+'</td>' +
        '<td style="padding:7px 10px;font-size:11px;color:var(--gray)">'+(p.echeance||'—')+'</td>' +
        '<td style="padding:7px 10px;text-align:right;font-weight:700;color:var(--success);font-size:14px">'+parseFloat(p.montant||0).toFixed(2)+' €</td>' +
        '<td style="padding:7px 8px;text-align:right;white-space:nowrap">' +
          '<button class="btn btn-secondary btn-sm" style="padding:4px 8px" data-aid="'+a.id+'" data-pid="'+p.id+'" onclick="openEditPaiement(this.dataset.aid,this.dataset.pid)"><i class="ti ti-edit" aria-hidden="true"></i></button> ' +
          '<button class="btn btn-sm btn-icon" style="padding:4px 7px" data-aid2="'+a.id+'" data-pid2="'+p.id+'" onclick="deletePaiement(this.dataset.aid2,this.dataset.pid2)">✕</button>' +
        '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    // Total sous le tableau
    html += '<div style="text-align:right;font-size:12px;color:var(--gray);padding-right:100px">' +
      '<span>Total : <strong style="color:var(--success)">'+c.verse.toFixed(2)+' €</strong> réglé(s) sur '+c.montant.toFixed(2)+' € · '+paiements.length+' versement(s)</span></div>';
  }

  html += '</div>';
  return html;
}

function togglePayRow(adherentId) {
  _payOpenId = (_payOpenId === adherentId) ? null : adherentId;
  renderPaiements();
  // Scroll vers la ligne si on l'ouvre
  if (_payOpenId) {
    setTimeout(function(){
      var row = document.getElementById('pay-detail-row-'+adherentId);
      if (row) row.scrollIntoView({behavior:'smooth', block:'nearest'});
    }, 50);
  }
}

function sortPay(col) {
  if (paySortCol === col) paySortDir *= -1; else { paySortCol = col; paySortDir = 1; }
  ['nom','montant','reste'].forEach(function(c) {
    var el = document.getElementById('psort_' + c);
    if (el) { if (c === paySortCol) el.textContent = paySortDir===1?'↑':'↓'; else el.innerHTML = '<i class="ti ti-arrows-sort" aria-hidden="true"></i>'; }
  });
  renderPaiements();
}

function togglePaySel(id, checked) {
  paySelected[id] = checked;
  document.getElementById('paySelCount').textContent = Object.keys(paySelected).filter(function(k){return paySelected[k];}).length + ' sélectionné(s)';
}

function toggleSelectAllPay(checked) {
  var rows = document.querySelectorAll('#paiementsTable tr');
  rows.forEach(function(row) {
    var cb = row.querySelector('input[type=checkbox]');
    if (cb) {
      // Use data-adid2 attribute set on the checkbox
      var id = cb.dataset.adid2;
      if (!id) return;
      cb.checked = checked;
      paySelected[id] = checked;
    }
  });
  document.getElementById('paySelCount').textContent = Object.keys(paySelected).filter(function(k){return paySelected[k];}).length + ' sélectionné(s)';
}

// ── PANEL DÉTAIL ───────────────────────────────────────────────────
function openPaiDetail(adherentId) {
  // Redirige vers le système de ligne dépliable
  togglePayRow(adherentId);
}

function closePaiDetail() {
  _payOpenId = null;
  renderPaiements();
}

// Kept for panel in fiche adhérent — rendered separately in loadFichePaiements
function renderPaiDetailContent(a) {
  var el = document.getElementById('payDetailContent'); if (!el) return;
  var c = payCalc(a);
  var paiements = (a.paiements||[]).slice().sort(function(x,y){return (x.dateReception||x.datePaiement||'').localeCompare(y.dateReception||y.datePaiement||'');});
  var progPct = c.montant > 0 ? Math.min(100, Math.round(c.verse/c.montant*100)) : 0;
  var progColor = progPct >= 100 ? 'var(--success)' : progPct > 0 ? 'var(--warn)' : 'var(--danger)';

  var html = '<div style="padding:22px 24px;border-bottom:1px solid var(--bg3);position:sticky;top:0;background:var(--bg2);z-index:10;display:flex;align-items:center;justify-content:space-between">';
  html += '<div>';
  html += '<div style="font-size:18px;font-weight:700">' + a.prenom + ' ' + a.nom + '</div>';
  html += '<div style="font-size:12px;color:var(--gray)">' + (a.formule_label||'') + ' · ' + (a.catage||'') + '</div>';
  html += '</div>';
  html += '<button onclick="closePaiDetail()" style="background:var(--bg3);border:none;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center">✕</button>';
  html += '</div>';

  // Synthèse financière
  html += '<div style="padding:20px 24px;border-bottom:1px solid var(--bg3)">';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px">';
  html += '<div style="text-align:center;padding:12px;background:var(--bg);border-radius:var(--radius)"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:6px">À régler</div><div style="font-size:20px;font-weight:800">' + c.montant.toFixed(2) + ' €</div></div>';
  html += '<div style="text-align:center;padding:12px;background:rgba(22,163,74,0.06);border-radius:var(--radius)"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:6px">Réglé</div><div style="font-size:20px;font-weight:800;color:var(--success)">' + c.verse.toFixed(2) + ' €</div></div>';
  html += '<div style="text-align:center;padding:12px;background:rgba(' + (c.reste>0?'220,38,38':'22,163,74') + ',0.06);border-radius:var(--radius)"><div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--gray);letter-spacing:0.06em;margin-bottom:6px">Reste</div><div style="font-size:20px;font-weight:800;color:' + (c.reste>0?'var(--danger)':'var(--success)') + '">' + c.reste.toFixed(2) + ' €</div></div>';
  html += '</div>';
  // Barre de progression
  html += '<div style="margin-bottom:6px;display:flex;justify-content:space-between;font-size:11px;color:var(--gray)"><span>Progression</span><span>' + progPct + '%</span></div>';
  html += '<div class="progress-bar"><div class="progress-fill" style="width:' + progPct + '%;background:' + progColor + '"></div></div>';
  html += '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;justify-content:space-between">' + payStatBadge(c.statut);
  if (c.reste > 0 && c.reste !== c.montant) html += '<span style="font-size:11px;color:var(--warn)">Dernier versement insuffisant</span>';
  if (c.verse > c.montant && c.montant > 0) html += '<span class="badge badge-warn"><i class="ti ti-alert-triangle" aria-hidden="true"></i> Trop-perçu</span>';
  html += '</div></div>';

  // Bouton ajouter paiement
  html += '<div style="padding:14px 24px;border-bottom:1px solid var(--bg3)">';
  html += '<button class="btn btn-primary" style="width:100%" data-adid3="' + a.id + '" onclick="openAddPaiement(this.dataset.adid3)">+ Enregistrer un paiement</button>';
  html += '</div>';

  // Historique paiements
  html += '<div style="padding:14px 24px">';
  html += '<div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--gray);margin-bottom:12px">Historique des paiements</div>';
  if (!paiements.length) {
    html += '<div style="color:var(--gray);font-size:13px;text-align:center;padding:24px 0">Aucun paiement enregistré</div>';
  } else {
    paiements.forEach(function(p) {
      var isAuto = PAY_MODES_AUTO.indexOf(p.type) >= 0;
      html += '<div style="background:var(--bg);border-radius:var(--radius);padding:12px 14px;margin-bottom:8px;border:1px solid var(--bg3)">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center">';
      html += '<div>';
      var tpInfo = (db.typesPaiement||[]).find(function(tp){ return tp.libelle === p.type; });
      var tpColor = tpInfo ? tpInfo.couleur : '#636366';
      html += '<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:' + tpColor + '20;color:' + tpColor + ';border:1px solid ' + tpColor + '40">' + (p.type||'—') + '</span>';
      if (isAuto) html += ' <span style="font-size:10px;color:var(--info)"><i class="ti ti-bolt" aria-hidden="true"></i> Auto</span>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--success);margin-top:4px">' + parseFloat(p.montant||0).toFixed(2) + ' €</div>';
      html += '</div>';
      html += '<div style="text-align:right;font-size:11px;color:var(--gray)">';
      html += (p.dateReception ? '<div>Réception : ' + fmtDate(p.dateReception) + '</div>' : '');
      html += (p.datePaiement ? '<div>Paiement : ' + fmtDate(p.datePaiement) + '</div>' : '');
      html += '</div></div>';
      html += '<div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end">';
      html += '<button class="btn btn-secondary btn-sm" data-aid="' + a.id + '" data-pid="' + p.id + '" onclick="openEditPaiement(this.dataset.aid,this.dataset.pid)"><i class="ti ti-edit" aria-hidden="true"></i> Modifier</button>';
      html += '<button class="btn btn-sm btn-icon" data-aid2="' + a.id + '" data-pid2="' + p.id + '" onclick="deletePaiement(this.dataset.aid2,this.dataset.pid2)">✕</button>';
      html += '</div></div>';
    });
  }
  html += '</div>';
  el.innerHTML = html;
}

// ── MODALE SAISIE PAIEMENT ─────────────────────────────────────────
function openAddPaiement(adherentId) {
  window._payAdherentId = adherentId;
  window._payEditId = null;
  var a = db.adherents.find(function(x){return x.id===adherentId;}); if (!a) return;

  // Bloquer si membre rattaché à un chef de famille
  if (isMembreFamille(a)) {
    var chef = db.adherents.find(function(x){ return x.id === a.chef_famille; });
    toast('Paiement géré par le chef de famille : ' + (chef ? chef.prenom + ' ' + chef.nom : ''), 'error');
    return;
  }

  var c = payCalc(a);
  var todayStr = new Date().toISOString().split('T')[0];
  var modes = getPayModes();
  // Mode par défaut = celui de la fiche adhérent
  var defaultMode = a.modepay || (modes[0]||'');
  var modeOpts = modes.map(function(m){ return '<option'+(m===defaultMode?' selected':'')+'>'+m+'</option>'; }).join('');
  // Fractionnement par défaut depuis la fiche
  var defaultFrac = parseInt(a.fractionn)||1;
  var defaultMode_tp = (db.typesPaiement||[]).find(function(t){return t.libelle===defaultMode;});
  if(defaultMode_tp && defaultMode_tp.fractionnable === 'Non') defaultFrac = 1;
  // Montant à régler = montant cotisation ou reste
  var montantTotal = parseFloat(a.montant||0)||c.reste||0;
  if(montantTotal<=0) montantTotal = c.reste > 0 ? c.reste : 0;

  var body = '<div style="margin-bottom:14px;background:var(--bg);border-radius:var(--radius);padding:10px 14px;font-size:13px">' +
    '<i class="ti ti-credit-card" aria-hidden="true"></i> Paiement pour <strong>'+a.prenom+' '+a.nom+'</strong> — À régler : <strong style="color:'+(c.reste>0?'var(--danger)':'var(--success)')+'">'+montantTotal.toFixed(2)+' €</strong></div>' +
    '<div class="form-grid">' +
    '<div class="field"><label>Mode de paiement *</label><select id="ap_type" onchange="onPayModalTypeChange('+montantTotal+')">'+modeOpts+'</select></div>' +
    '<div class="field"><label>Montant total (€) *</label><input type="number" id="ap_montant" value="'+(montantTotal>0?montantTotal.toFixed(2):'') +'" step="0.01" min="0" placeholder="0.00" oninput="buildEcheances()"></div>' +
    '<div class="field"><label>Date 1er paiement *</label><input type="date" id="ap_datereception" value="'+todayStr+'" oninput="buildEcheances()"></div>' +
    '<div class="field"><label>Référence <span style="font-weight:400;color:var(--gray)">(n° de chèque…)</span></label><input type="text" id="ap_reference" value="" placeholder="Ex : n° de chèque"></div>' +
    '<div class="field"><label>Fractionnement <span id="ap_frac_lock" style="font-size:10px;color:var(--danger)"></span></label>' +
    '<input type="number" id="ap_fois" value="'+defaultFrac+'" min="1" max="10" style="width:80px" oninput="buildEcheances()"> <span style="font-size:12px;color:var(--gray)">fois</span></div>' +
    '</div>' +
    '<div id="ap_echeances" style="margin-top:12px"></div>';

  openModal('Enregistrer un paiement', body, [
    {label:'Annuler', cls:'btn-secondary', action:'closeModal()'},
    {label:'Enregistrer', cls:'btn-primary', action:'savePaiementNew()'}
  ]);
  // Construire les échéances après affichage
  setTimeout(function(){buildEcheances();onPayModalTypeChange(montantTotal);},50);
}

function onPayModalTypeChange(montantTotal){
  var mode = document.getElementById('ap_type').value;
  var tp = (db.typesPaiement||[]).find(function(t){return t.libelle===mode;});
  var fracEl = document.getElementById('ap_fois');
  var lockEl = document.getElementById('ap_frac_lock');
  if(tp && tp.fractionnable === 'Non'){
    if(fracEl){fracEl.value=1;fracEl.disabled=true;}
    if(lockEl)lockEl.textContent='(non fractionnable)';
  } else {
    if(fracEl)fracEl.disabled=false;
    if(lockEl)lockEl.textContent='';
  }
  buildEcheances();
}

function buildEcheances(){
  var el = document.getElementById('ap_echeances'); if(!el) return;
  var montant = parseFloat(document.getElementById('ap_montant').value)||0;
  var n = Math.max(1,Math.min(10,parseInt(document.getElementById('ap_fois').value)||1));
  var dateStr = document.getElementById('ap_datereception').value || new Date().toISOString().split('T')[0];
  if(n<=1){el.innerHTML='';return;}
  // Montants entiers, ajustement exact sur le dernier
  var base = Math.floor(montant / n);
  var total_base = base * (n - 1);
  var dernier = Math.round((montant - total_base) * 100) / 100;
  var rows = '';
  for(var i=0;i<n;i++){
    var d = new Date(dateStr);
    d.setMonth(d.getMonth()+i);
    var dStr = d.toISOString().split('T')[0];
    var mEch = i<n-1 ? base : dernier;
    rows += '<div style="display:grid;grid-template-columns:auto 1fr 1fr 1fr;gap:8px;align-items:center;margin-bottom:6px">' +
      '<span style="font-size:12px;font-weight:600;color:var(--gray);min-width:60px">Échéance '+(i+1)+'/'+n+'</span>' +
      '<div class="field" style="margin:0"><label style="font-size:10px">Date</label><input type="date" id="ap_ech_date_'+i+'" value="'+dStr+'"></div>' +
      '<div class="field" style="margin:0"><label style="font-size:10px">Montant (€)</label><input type="number" id="ap_ech_mont_'+i+'" value="'+mEch.toFixed(2)+'" step="0.01" min="0" style="text-align:right"></div>' +
      '<div class="field" style="margin:0"><label style="font-size:10px">Référence</label><input type="text" id="ap_ech_ref_'+i+'" placeholder="n° chèque…"></div>' +
      '</div>';
  }
  el.innerHTML = '<div style="background:rgba(200,80,26,0.06);border-radius:8px;padding:12px;border:1px solid rgba(200,80,26,0.15)">' +
    '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#C8501A;margin-bottom:8px"><i class="ti ti-calendar-event" aria-hidden="true"></i> Échéances générées</div>' +
    rows + '</div>';
}

function openEditPaiement(adherentId, paiementId) {
  window._payAdherentId = adherentId;
  window._payEditId = paiementId;
  var a = db.adherents.find(function(x){return x.id===adherentId;}); if (!a) return;
  var p = (a.paiements||[]).find(function(x){return x.id===paiementId;}); if (!p) return;
  var modeOpts = PAY_MODES.map(function(m){ return '<option' + (m===p.type?' selected':'') + '>' + m + '</option>'; }).join('');

  var body = '<div class="form-grid">' +
    '<div class="field"><label>Type de paiement *</label><select id="ap_type" onchange="onPayTypeChange()">' + modeOpts + '</select></div>' +
    '<div class="field"><label>Montant (€) *</label><input type="number" id="ap_montant" value="' + (p.montant||'') + '" step="0.01" min="0"></div>' +
    '<div class="field"><label>Date de réception</label><input type="date" id="ap_datereception" value="' + (p.dateReception||'') + '"></div>' +
    '<div class="field"><label>Date du paiement</label><input type="date" id="ap_datepaiement" value="' + (p.datePaiement||'') + '"></div>' +
    '<div class="field form-full"><label>Référence <span style="font-weight:400;color:var(--gray)">(n° de chèque…)</span></label><input type="text" id="ap_reference" value="' + escHtml(p.reference||'') + '" placeholder="Ex : n° de chèque"></div>' +
    '</div>';

  openModal('Modifier le paiement', body, [
    {label:'Annuler', cls:'btn-secondary', action:'closeModal()'},
    {label:'Enregistrer', cls:'btn-primary', action:'savePaiementNew()'}
  ]);
}

function onPayTypeChange() {
  var type = document.getElementById('ap_type').value;
  var isAuto = getPayModesAuto().indexOf(type) >= 0;
  var datePaie = document.getElementById('ap_datepaiement');
  if (isAuto && datePaie) {
    var dateRec = document.getElementById('ap_datereception');
    datePaie.value = dateRec ? dateRec.value : '';
  } else if (datePaie && !window._payEditId) {
    datePaie.value = '';
  }
}

async function savePaiementNew() {
  var type = document.getElementById('ap_type').value;
  var montant = parseFloat(document.getElementById('ap_montant').value);
  if (!montant || montant <= 0) { toast('Montant obligatoire', 'error'); return; }
  var adherentId = window._payAdherentId;
  var a = db.adherents.find(function(x){return x.id===adherentId;}); if (!a) return;
  if (!a.paiements) a.paiements = [];
  var n = Math.max(1,Math.min(10,parseInt((document.getElementById('ap_fois')||{}).value)||1));
  var tp = (db.typesPaiement||[]).find(function(t){return t.libelle===type;});
  if(tp && tp.fractionnable==='Non') n=1;
  var dateRec = (document.getElementById('ap_datereception')||{}).value || new Date().toISOString().split('T')[0];
  var reference = ((document.getElementById('ap_reference')||{}).value || '').trim();

  if (window._payEditId) {
    var p = {
      id: window._payEditId, type: type, montant: montant,
      dateReception: dateRec,
      datePaiement: (document.getElementById('ap_datepaiement')||{value:dateRec}).value||dateRec,
      reference: reference
    };
    var idx = a.paiements.findIndex(function(x){return x.id===window._payEditId;});
    if (idx >= 0) a.paiements[idx] = p;
  } else if (n <= 1) {
    a.paiements.push({
      id: 'pay_'+Date.now(), type: type, montant: montant,
      dateReception: dateRec, datePaiement: dateRec, reference: reference
    });
  } else {
    for (var i = 0; i < n; i++) {
      var dateEch = (document.getElementById('ap_ech_date_'+i)||{}).value || '';
      var montEch = parseFloat((document.getElementById('ap_ech_mont_'+i)||{}).value) || Math.round(montant/n*100)/100;
      var refEch = ((document.getElementById('ap_ech_ref_'+i)||{}).value || '').trim() || reference;
      if(!dateEch){var d2=new Date(dateRec);d2.setMonth(d2.getMonth()+i);dateEch=d2.toISOString().split('T')[0];}
      a.paiements.push({
        id: 'pay_'+Date.now()+'_'+i, type: type, montant: montEch,
        dateReception: dateRec, datePaiement: dateEch,
        echeance: (i+1)+'/'+n, reference: refEch
      });
    }
  }

  a.verse = a.paiements.reduce(function(s,pp){return s+(parseFloat(pp.montant)||0);},0).toString();
  var c = payCalc(a); a.statpay = c.statut;
  // Propager le statut de paiement aux membres rattachés
  if (a.famille_lien === 'chef') {
    db.adherents.filter(function(m){ return m.chef_famille === a.id; }).forEach(function(m){
      m.statpay = c.statut;
    });
  }
  // Ventiler automatiquement dans la trésorerie si configuré
  var _vent = ventilPayAdherent(a, false);
  // Écriture granulaire : la fiche, les membres de la famille (statut propagé)
  // et les postes de ventilation — rien d'autre. En cas de refus, on ne ferme
  // pas la fenêtre et on n'annonce pas un enregistrement qui n'a pas eu lieu.
  if (!await saveAdherentGranulaire(a)) return;
  closeModal();
  _payOpenId = adherentId;
  renderPaiements();
  if (document.getElementById('fiche-paiements-list')) setTimeout(loadFichePaiements, 100);
  toast(n > 1 ? (n+' paiements enregistrés !') : 'Paiement enregistré !', 'success');
  // Avertir si un poste n'a pas pu être ventilé faute de catégorie configurée
  if (_vent && _vent.warnings && _vent.warnings.length) {
    var _noms = _vent.warnings.map(function(w){ return w.poste + ' (' + parseFloat(w.montant).toFixed(2) + ' €)'; }).join(', ');
    setTimeout(function(){
      toast('Ventilation incomplète : aucune catégorie configurée pour ' + _noms + '. À régler dans Trésorerie → Paramètres.', 'error');
    }, 800);
  }
}

function deletePaiement(adherentId, paiementId) {
  var a = db.adherents.find(function(x){return x.id===adherentId;}); if (!a) return;
  var p = (a.paiements||[]).find(function(x){return x.id===paiementId;});
  openConfirmModal('Supprimer ce paiement',
    'Supprimer le paiement de <strong>' + parseFloat(p&&p.montant||0).toFixed(2) + ' €</strong> (' + (p&&p.type||'') + ') ?',
    async function() {
      a.paiements = (a.paiements||[]).filter(function(x){return x.id!==paiementId;});
      a.verse = a.paiements.reduce(function(s,pp){return s+(parseFloat(pp.montant)||0);},0).toString();
      var c = payCalc(a);
      a.statpay = c.statut;
      // Propager le statut aux membres rattachés
      if (a.famille_lien === 'chef') {
        db.adherents.filter(function(m){ return m.chef_famille === a.id; }).forEach(function(m){
          m.statpay = c.statut;
        });
      }
      // Recalculer la ventilation trésorerie
      ventilPayAdherent(a, false);
      // Écriture granulaire (fiche + famille + ventilation) au lieu de toute la base
      if (!await saveAdherentGranulaire(a)) return;
      _payOpenId = adherentId; // Garder la ligne ouverte après suppression
      renderPaiements();
      if (document.getElementById('fiche-paiements-list')) setTimeout(loadFichePaiements, 100);
      toast('Paiement supprimé', 'error');
    }
  );
}

// ── RELANCE GROUPÉE ─────────────────────────────────────────────────
function openRelanceGroupee() {
  var selected = Object.keys(paySelected).filter(function(k){return paySelected[k];});
  var adherents = selected.map(function(id){return db.adherents.find(function(a){return a.id===id;});}).filter(Boolean);
  if (!adherents.length) {
    // Prendre les non-soldés si aucune sélection
    adherents = (db.adherents||[]).filter(function(a){ var c=payCalc(a); return c.reste>0 && c.montant>0; });
    if (!adherents.length) { toast('Aucun adhérent avec un reste à régler', 'error'); return; }
  }
  var body = '<div style="margin-bottom:14px;font-size:13px;background:var(--bg);border-radius:var(--radius);padding:10px 14px">' +
    '<strong>' + adherents.length + ' adhérent(s)</strong> concerné(s) par cette relance.</div>' +
    '<div class="field form-full" style="margin-bottom:14px"><label>Objet de l\'email</label>' +
    '<input type="text" id="rel_objet" value="[Tennis Club Issois] Rappel règlement adhésion ' + (db.params&&db.params.saison||new Date().getFullYear()) + '"></div>' +
    '<div class="field"><label>Corps du message</label>' +
    '<textarea id="rel_corps" style="min-height:140px"></textarea></div>' +
    '<div style="font-size:11px;color:var(--gray);margin-top:8px">Variables disponibles : [NOM], [PRENOM], [MONTANT], [VERSE], [RESTE]</div>';

  openModal('Relance groupée — ' + adherents.length + ' adhérent(s)', body, [
    {label:'Annuler', cls:'btn-secondary', action:'closeModal()'},
    {label:'Générer les emails', cls:'btn-primary', action:'genererRelances()'}
  ]);
  window._relAdherents = adherents;
  // Set default message after modal renders
  setTimeout(function() {
    var ta = document.getElementById('rel_corps');
    if (ta) ta.value = 'Madame, Monsieur [NOM],\n\nNous vous rappelons qu\'il reste [RESTE] \u20ac \u00e0 r\u00e9gler pour votre adh\u00e9sion au Tennis Club Issois.\n\nMontant total : [MONTANT] \u20ac\nD\u00e9j\u00e0 r\u00e9gl\u00e9 : [VERSE] \u20ac\nRestant d\u00fb : [RESTE] \u20ac\n\nMerci de r\u00e9gulariser votre situation dans les meilleurs d\u00e9lais.\n\nCordialement,\nLe Bureau du Tennis Club Issois';
  }, 50);
}

function genererRelances() {
  var objet = document.getElementById('rel_objet').value;
  var corps = document.getElementById('rel_corps').value;
  var adherents = window._relAdherents || [];
  var ok = 0;
  adherents.forEach(function(a) {
    if (!a.email) return;
    var c = payCalc(a);
    var msg = corps
      .replace('[NOM]', a.nom + ' ' + a.prenom)
      .replace('[PRENOM]', a.prenom)
      .replace('[MONTANT]', c.montant.toFixed(2) + ' €')
      .replace('[VERSE]', c.verse.toFixed(2) + ' €')
      .replace('[RESTE]', c.reste.toFixed(2) + ' €');
    var mailto = 'mailto:' + a.email + '?subject=' + encodeURIComponent(objet) + '&body=' + encodeURIComponent(msg);
    // Enregistrer dans histomail (endpoint dédié : la sauvegarde globale ignore mailHistory)
    logMailHistory({date:new Date().toISOString().split('T')[0],destinataire:a.email,objet:objet,statut:'Généré'});
    ok++;
    // Ouvrir le client mail
    window.open(mailto);
  });
  closeModal();
  toast(ok + ' email(s) généré(s) !', 'success');
  var noEmail = adherents.filter(function(a){return !a.email;}).length;
  if (noEmail) toast(noEmail + ' adhérent(s) sans email ignoré(s)', 'error');
}

// ── EXPORT ─────────────────────────────────────────────────────────
function exportPayCSV() {
  // Saison concernée : seuls les adhérents de la saison courante sont exportés.
  var saison = (typeof currentSaison === 'function' ? currentSaison() : (db.currentSaison || '')) || '';
  var adherents = (db.adherents || []).filter(function(a){ return !a.saison || a.saison === saison; });
  var today = new Date().toISOString().split('T')[0];
  var _d = function(v){ return (typeof fmtDate === 'function' ? (fmtDate(v) || '') : (v || '')); };

  // ── Feuille 1 : Synthèse (1 ligne par adhérent) ──
  var synthH = ['Nom','Prénom','Formule','Montant à régler (€)','Réglé (€)','Reste (€)','Statut','Modes de paiement','Références'];
  var synthRows = adherents.map(function(a) {
    var c = payCalc(a);
    var modes = (a.paiements||[]).map(function(p){return p.type;}).filter(function(v,i,arr){return v && arr.indexOf(v)===i;}).join(' / ');
    var refs  = (a.paiements||[]).map(function(p){return (p.reference||'').trim();}).filter(function(v,i,arr){return v && arr.indexOf(v)===i;}).join(' / ');
    return [a.nom||'', a.prenom||'', a.formule_label||'',
            +c.montant.toFixed(2), +c.verse.toFixed(2), +c.reste.toFixed(2),
            c.statut, modes, refs];
  });
  var ws1 = XLSX.utils.aoa_to_sheet([synthH].concat(synthRows));
  ws1['!cols'] = [{wch:18},{wch:14},{wch:22},{wch:18},{wch:12},{wch:12},{wch:10},{wch:22},{wch:20}];

  // ── Feuille 2 : Détail des paiements (1 ligne par paiement, prévu ou effectué) ──
  var detH = ['Nom','Prénom','Échéance','Mode','Montant (€)','Date réception','Date paiement','Référence','État'];
  var detRows = [];
  adherents.forEach(function(a) {
    (a.paiements||[]).forEach(function(p) {
      // « Prévu » si la date de paiement est dans le futur, sinon « Effectué ».
      var etat = (p.datePaiement && p.datePaiement > today) ? 'Prévu' : 'Effectué';
      detRows.push([
        a.nom||'', a.prenom||'',
        p.echeance || '',
        p.type || '',
        +(parseFloat(p.montant||0).toFixed(2)),
        _d(p.dateReception),
        _d(p.datePaiement),
        p.reference || '',
        etat
      ]);
    });
  });
  var ws2 = XLSX.utils.aoa_to_sheet([detH].concat(detRows));
  ws2['!cols'] = [{wch:18},{wch:14},{wch:9},{wch:14},{wch:12},{wch:15},{wch:15},{wch:18},{wch:10}];

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, 'Synthèse');
  XLSX.utils.book_append_sheet(wb, ws2, 'Détail paiements');
  var fname = 'TCI_Paiements_' + (saison ? String(saison).replace(/[^a-zA-Z0-9_-]/g,'_') : 'saison') + '.xlsx';
  XLSX.writeFile(wb, fname);
  toast('Export Excel téléchargé !', 'success');
}


// ── TYPES DE PAIEMENT (Paramètres) ────────────────────────────────
function renderTypesPaiement() {
  var el = document.getElementById('types-pai-list'); if (!el) return;
  var types = db.typesPaiement || [];
  var hdr = '<div style="display:grid;grid-template-columns:1fr 140px 110px 60px 36px;gap:8px;margin-bottom:6px;padding:2px 10px">' +
    '<div style="font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.05em">Libellé</div>' +
    '<div style="font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.05em">Mode</div>' +
    '<div style="font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.05em">Fractionnable</div>' +
    '<div style="font-size:11px;font-weight:700;color:var(--gray);text-transform:uppercase;letter-spacing:0.05em">Couleur</div>' +
    '<div></div>' +
    '</div>';
  el.innerHTML = types.length
    ? (hdr + types.map(function(t, i) {
        var col = t.couleur || '#636366';
        var isFrac = t.fractionnable !== 'Non';
        return '<div style="display:grid;grid-template-columns:1fr 140px 110px 60px 36px;gap:8px;align-items:center;margin-bottom:8px;padding:10px;background:var(--bg);border-radius:8px;border-left:4px solid ' + col + '">' +
          '<div class="field"><input type="text" value="' + (t.libelle||'') + '" placeholder="Ex: Chèque" onchange="updateTP(' + i + ',\'libelle\',this.value)"></div>' +
          '<div class="field"><select onchange="updateTP(' + i + ',\'mode\',this.value)">' +
            '<option value="Automatique"' + (t.mode === 'Automatique' ? ' selected' : '') + '>⚡ Automatique</option>' +
            '<option value="Manuel"' + (t.mode === 'Manuel' ? ' selected' : '') + '>✋ Manuel</option>' +
          '</select></div>' +
          '<div class="field"><select onchange="updateTP(' + i + ',\'fractionnable\',this.value);renderTypesPaiement()">' +
            '<option value="Oui"' + (isFrac ? ' selected' : '') + '>✅ Oui</option>' +
            '<option value="Non"' + (!isFrac ? ' selected' : '') + '>🚫 Non</option>' +
          '</select></div>' +
          '<div class="field"><input type="color" value="' + col + '" style="padding:2px;height:34px;width:100%" onchange="updateTP(' + i + ',\'couleur\',this.value);renderTypesPaiement()"></div>' +
          '<button class="btn btn-sm btn-icon" onclick="removeTP(' + i + ')">✕</button>' +
          '</div>';
      }).join(''))
    : '<p style="color:var(--gray);font-size:13px">Aucun mode de paiement défini.</p>';
}

function updateTP(i, key, val) {
  if (db.typesPaiement && db.typesPaiement[i]) db.typesPaiement[i][key] = val;
}

function removeTP(i) {
  openConfirmModal('Supprimer ce mode', 'Supprimer ce mode de paiement ?', function() {
    db.typesPaiement.splice(i, 1);
    renderTypesPaiement();
    toast('Mode supprimé', 'error');
  });
}

function addTypePai() {
  if (!db.typesPaiement) db.typesPaiement = [];
  db.typesPaiement.push({id: 'tp_' + Date.now(), libelle: '', mode: 'Manuel', couleur: '#636366'});
  renderTypesPaiement();
}

function saveTypesPaiement() {
  scheduleSave();
  toast('Modes de paiement enregistrés !', 'success');
}


// ── PLAN COMPTABLE ─────────────────────────────────────────────────
var DEFAULT_PLAN_COMPTABLE = [
  {classe:1,numero:'102000',intitule:'Fonds associatifs sans droit de reprise',type:'Bilan',commentaire:'Capitaux propres de l\'association'},
  {classe:1,numero:'110000',intitule:'Report à nouveau',type:'Bilan',commentaire:'Résultat des exercices antérieurs'},
  {classe:1,numero:'120000',intitule:'Résultat de l\'exercice',type:'Bilan',commentaire:'Excédent ou déficit annuel'},
  {classe:5,numero:'512000',intitule:'Banque',type:'Bilan',commentaire:'Compte bancaire principal'},
  {classe:5,numero:'530000',intitule:'Caisse',type:'Bilan',commentaire:'Espèces'},
  {classe:5,numero:'511200',intitule:'Chèques à encaisser',type:'Bilan',commentaire:'Chèques non encore déposés'},
  {classe:6,numero:'606300',intitule:'Achats d\'équipements sportifs',type:'Charge',commentaire:'Maillots, protections, matériel lourd'},
  {classe:6,numero:'606310',intitule:'Petits matériels sportifs',type:'Charge',commentaire:'Ballons, plots, chasubles'},
  {classe:6,numero:'613200',intitule:'Location installations sportives',type:'Charge',commentaire:'Gymnase, terrain, salle'},
  {classe:6,numero:'615000',intitule:'Entretien matériel',type:'Charge',commentaire:'Réparations et maintenance'},
  {classe:6,numero:'625100',intitule:'Déplacements compétitions',type:'Charge',commentaire:'Déplacements équipes'},
  {classe:6,numero:'625110',intitule:'Transports collectifs',type:'Charge',commentaire:'Bus, minibus'},
  {classe:6,numero:'622600',intitule:'Honoraires arbitres / intervenants',type:'Charge',commentaire:'Arbitrage, entraîneurs occasionnels'},
  {classe:6,numero:'628100',intitule:'Licences fédérales',type:'Charge',commentaire:'Licences sportives'},
  {classe:6,numero:'628200',intitule:'Cotisations fédérales',type:'Charge',commentaire:'Affiliation fédération'},
  {classe:6,numero:'616000',intitule:'Assurances',type:'Charge',commentaire:'Responsabilité civile, assurance club'},
  {classe:6,numero:'623100',intitule:'Communication / impression',type:'Charge',commentaire:'Affiches, flyers'},
  {classe:7,numero:'756000',intitule:'Cotisations des adhérents',type:'Produit',commentaire:'Adhésions annuelles'},
  {classe:7,numero:'706100',intitule:'Stages sportifs',type:'Produit',commentaire:'Stages pendant vacances'},
  {classe:7,numero:'706200',intitule:'Événements sportifs',type:'Produit',commentaire:'Tournois, rencontres'},
  {classe:7,numero:'741100',intitule:'Subventions mairie',type:'Produit',commentaire:'Subvention communale'},
  {classe:7,numero:'741200',intitule:'Subventions département',type:'Produit',commentaire:'Subvention départementale'},
  {classe:7,numero:'758100',intitule:'Buvette et ventes annexes',type:'Produit',commentaire:'Ventes boissons, snacks'},
  {classe:8,numero:'870000',intitule:'Contributions volontaires (charges)',type:'Information',commentaire:'Bénévolat, mise à disposition'},
  {classe:8,numero:'870900',intitule:'Contributions volontaires (produits)',type:'Information',commentaire:'Contrepartie classe 8'}
];

function getPlanComptable() {
  if (!db.planComptable || !db.planComptable.length) db.planComptable = JSON.parse(JSON.stringify(DEFAULT_PLAN_COMPTABLE));
  return db.planComptable;
}

function renderPlanComptable() {
  var pca = getPlanComptable();
  var tbody = document.getElementById('plan-comptable-tbody'); if (!tbody) return;
  var typeOpts = ['Bilan','Charge','Produit','Information'].map(function(t){ return '<option>'+t+'</option>'; }).join('');
  tbody.innerHTML = pca.map(function(c,i) {
    return '<tr>' +
      '<td><input type="number" value="'+c.classe+'" style="width:60px" onchange="updatePca('+i+',\'classe\',this.value)"></td>' +
      '<td><input type="text" value="'+(c.numero||'')+'" style="width:90px;font-family:monospace" onchange="updatePca('+i+',\'numero\',this.value)"></td>' +
      '<td><input type="text" value="'+(c.intitule||'')+'" style="width:100%;min-width:200px" onchange="updatePca('+i+',\'intitule\',this.value)"></td>' +
      '<td><select onchange="updatePca('+i+',\'type\',this.value)">'+typeOpts.replace('<option>'+c.type+'</option>','<option selected>'+c.type+'</option>')+'</select></td>' +
      '<td><input type="text" value="'+(c.commentaire||'')+'" style="width:100%;min-width:140px" onchange="updatePca('+i+',\'commentaire\',this.value)"></td>' +
      '<td><button class="btn btn-sm btn-icon" onclick="deletePca('+i+')">✕</button></td>' +
    '</tr>';
  }).join('');
}

function updatePca(i, key, val) {
  var pca = getPlanComptable();
  if (pca[i]) pca[i][key] = key==='classe' ? (parseInt(val)||0) : val;
}

function addPlanComptableLine() {
  getPlanComptable().push({classe:'',numero:'',intitule:'',type:'Produit',commentaire:''});
  renderPlanComptable();
}

function deletePca(i) {
  getPlanComptable().splice(i,1);
  renderPlanComptable();
}

function savePlanComptable() {
  scheduleSave();
  toast('Plan comptable enregistré !', 'success');
}

function getPcaOptions() {
  return getPlanComptable().map(function(c){ return '<option value="'+c.numero+'">'+c.numero+' — '+c.intitule+'</option>'; }).join('');
}

// ── CATÉGORIES DE TRÉSORERIE ──────────────────────────────────────
// Catégorie dédiée au reliquat de ventilation (ligne « Cotisation non répartie »).
// Isole les sommes encaissées sans tarif en face, au lieu de les diluer dans les
// recettes d'adhésion — ce qui fausserait les états comptables.
var CAT_NON_REPARTI = 'Produits à régulariser';

var DEFAULT_CATEGORIES_TRESO = (function(){
  var recRows = [
    {cat: CAT_NON_REPARTI, sub:''},
    {cat:'Remises Chèques adhérents', sub:''},
    {cat:'Versements', sub:''},
    {cat:'Virements adhésions', sub:''},
    {cat:'Déplacement à Roland GARROS', sub:''},
    {cat:'Partenaires', sub:''},
    {cat:'Partenaires', sub:'Opération calendrier'},
    {cat:'Services', sub:''},
    {cat:'Services', sub:'Machine à corder'},
    {cat:'Services', sub:'Grips/balles/Textiles/raquettes'},
    {cat:'Intérêts', sub:''},
    {cat:'Total Subventions', sub:''},
    {cat:'Tournois', sub:''},
    {cat:'Tournois', sub:'TMC Vert (Automne)'},
    {cat:'Tournois', sub:'TMC Orange'},
    {cat:'Tournois', sub:'TMC interne Hop la Forme'},
    {cat:'Tournois', sub:'TMC Vert LIDL (juin)'},
    {cat:'Tournois', sub:'TMC 13/14 LIDL (juin)'},
    {cat:'Tournois', sub:'TMC 15/18 LIDL (juin)'},
    {cat:'Tournois', sub:'Tournoi interne'},
    {cat:'Tournois', sub:'TMC Femmes été'},
    {cat:'Tournois', sub:'Tournoi Séniors été'},
    {cat:'Tournois', sub:'TMC Hommes 2S été'},
    {cat:'Tournois', sub:'Aide au Développement Clubs'},
    {cat:'Court couvert (jetons et invités)', sub:''},
    {cat:'Court couvert (jetons et invités)', sub:'jetons (via Thierry ou JM)'},
    {cat:'Cautions clés + badges+ location courts', sub:''},
    {cat:'Manifestations', sub:''},
    {cat:'Manifestations', sub:'Barbecue été'},
    {cat:'Manifestations', sub:'Manifestations/fêtes'},
    {cat:'Manifestations', sub:'Journée Matchs libres'},
    {cat:'Manifestations', sub:'Tombola'},
    {cat:'Manifestations', sub:'Halloween'},
    {cat:'Manifestations', sub:'Noel'},
    {cat:'Manifestations', sub:'Pâques'},
    {cat:'Manifestations', sub:'Telethon'},
    {cat:'Manifestations', sub:'Double Mixte Challenge'},
    {cat:'Manifestations', sub:'Tennis en fete'},
    {cat:'Opération textile', sub:''},
    {cat:'Divers', sub:''},
    {cat:'Divers', sub:'Vente calendriers (... pièces)'},
  ];
  var rows = [];
  recRows.forEach(function(r) {
    var id = 'ct_r_' + r.cat.replace(/\W/g,'_') + (r.sub ? '_'+r.sub.replace(/\W/g,'_') : '');
    rows.push({id:id, categorie:r.cat, souscategorie:r.sub, recette:true, depense:false, compte:''});
  });
  var dep = [
    'Salaires nets','Charges salariales','Téléphonie','Assurances',
    'Licences et engagements','Cotisations championnat','Manifestations',
    'Roland Garros / Événements','Textile','Balles et matériel tennis',
    'Club House / Entretien','Frais bancaires','Formation',
    'Divers / Remboursements','Frais de réception','Tournois',
    'Communication','Transport / Déplacements','Investissements'
  ];
  dep.forEach(function(cat) {
    rows.push({id:'ct_d_'+cat.replace(/\W/g,'_'),categorie:cat,souscategorie:'',recette:false,depense:true,compte:''});
  });
  return rows;
})();

// La catégorie dédiée doit exister même sur une base déjà peuplée : les clubs
// installés ont leurs catégories en base, et DEFAULT_CATEGORIES_TRESO ne sert
// qu'aux installations vierges. On l'ajoute donc si elle manque. Idempotent.
function ensureCatNonReparti(cats) {
  if (cats.some(function(c){ return c.categorie === CAT_NON_REPARTI; })) return false;
  cats.push({
    id: 'ct_r_' + CAT_NON_REPARTI.replace(/\W/g,'_'),   // même schéma d'id que les défauts
    categorie: CAT_NON_REPARTI, souscategorie: '',
    recette: true, depense: false, compte: ''
  });
  return true;
}

function getCategoriesTreso() {
  if (!db.categoriesTreso || !db.categoriesTreso.length) db.categoriesTreso = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES_TRESO));
  ensureCatNonReparti(db.categoriesTreso);
  return db.categoriesTreso;
}

function renderCategoriesTreso() {
  var el = document.getElementById('categories-treso-tree'); if (!el) return;
  var cats = getCategoriesTreso();
  var pcaOpts = '<option value="">— Aucun —</option>' + getPcaOptions();

  // Grouper par catégorie
  var catMap = {}; // {catName: [{entry, idx}, ...]}
  var catOrder = [];
  cats.forEach(function(c, i) {
    var cat = c.categorie || '(sans nom)';
    if (!catMap[cat]) { catMap[cat] = []; catOrder.push(cat); }
    catMap[cat].push({entry: c, idx: i});
  });

  var html = '';
  if (catOrder.length === 0) {
    html = '<div style="text-align:center;color:var(--gray);padding:32px">Aucune catégorie. Cliquez sur "+ Nouvelle catégorie".</div>';
    el.innerHTML = html;
    return;
  }

  catOrder.forEach(function(catName) {
    var items = catMap[catName];
    var firstItem = items[0].entry;
    var firstIdx = items[0].idx;
    var collapsed = window._catTreeCollapsed && window._catTreeCollapsed[catName];
    // Badge types
    var hasRec = items.some(function(it){return it.entry.recette;});
    var hasDep = items.some(function(it){return it.entry.depense;});
    var badges = (hasRec ? '<span class="badge badge-success" style="font-size:10px;margin-left:6px">Recette</span>' : '') +
                 (hasDep ? '<span class="badge badge-danger" style="font-size:10px;margin-left:4px">Dépense</span>' : '');

    html += '<div class="cat-tree-group" style="border:1px solid var(--bg3);border-radius:var(--radius);margin:6px 16px;overflow:hidden">';

    // Header catégorie
    html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);cursor:pointer;user-select:none" onclick="toggleCatTreeGroup(this)">';
    html += '<span style="font-size:12px;color:var(--gray);min-width:14px">'+(collapsed?'▶':'▼')+'</span>';
    html += '<input type="text" value="'+escHtml(catName)+'" style="font-weight:700;font-size:14px;border:none;background:transparent;flex:1;min-width:0;padding:0;cursor:text" onclick="event.stopPropagation()" onchange="renameCatTresoGroup(\''+escJs(catName)+'\',this.value)">';
    html += badges;
    html += '<button class="btn btn-secondary btn-sm" style="font-size:11px" onclick="event.stopPropagation();addSubcatToGroup(\''+escJs(catName)+'\')">+ Sous-catégorie</button>';
    html += '<button class="btn btn-sm btn-icon" style="color:var(--danger)" onclick="event.stopPropagation();deleteCatGroup(\''+escJs(catName)+'\')" title="Supprimer la catégorie">✕</button>';
    html += '</div>';

    // Sous-catégories
    if (!collapsed) {
      html += '<div class="cat-tree-body">';
      if (items.length === 0) {
        html += '<div style="padding:10px 40px;color:var(--gray);font-style:italic;font-size:12px">Aucune sous-catégorie</div>';
      } else {
        items.forEach(function(it) {
          var c = it.entry; var i = it.idx;
          var subLabel = c.souscategorie || '(entrée principale)';
          html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 14px 8px 36px;border-top:1px solid var(--bg3);background:white">';
          html += '<span style="color:var(--bg3);font-size:14px">└</span>';
          html += '<input type="text" value="'+escHtml(c.souscategorie||'')+'" placeholder="Sous-catégorie (optionnelle)" style="flex:1;min-width:120px;font-size:13px" onchange="updateCatTreso('+i+',\'souscategorie\',this.value)">';
          html += '<label style="display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;cursor:pointer"><input type="checkbox"'+(c.recette?' checked':'')+' onchange="updateCatTreso('+i+',\'recette\',this.checked)"> Recette</label>';
          html += '<label style="display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap;cursor:pointer"><input type="checkbox"'+(c.depense?' checked':'')+' onchange="updateCatTreso('+i+',\'depense\',this.checked)"> Dépense</label>';
          html += '<select style="font-size:12px;min-width:140px;max-width:200px" onchange="updateCatTreso('+i+',\'compte\',this.value)">'+pcaOpts.replace('value="'+(c.compte||'')+('"'), 'value="'+(c.compte||'')+'" selected')+'</select>';
          html += '<button class="btn btn-sm btn-icon" onclick="deleteCatTreso('+i+')" title="Supprimer">✕</button>';
          html += '</div>';
        });
      }
      html += '</div>';
    }
    html += '</div>';
  });

  el.innerHTML = html;
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toggleCatTreeGroup(header) {
  var catName = header.querySelector('input').value;
  if (!window._catTreeCollapsed) window._catTreeCollapsed = {};
  window._catTreeCollapsed[catName] = !window._catTreeCollapsed[catName];
  renderCategoriesTreso();
}

function renameCatTresoGroup(oldName, newName) {
  newName = newName.trim();
  if (!newName || newName === oldName) { renderCategoriesTreso(); return; }
  getCategoriesTreso().forEach(function(c) {
    if (c.categorie === oldName) c.categorie = newName;
  });
  renderCategoriesTreso();
  scheduleSave();
}

function addSubcatToGroup(catName) {
  getCategoriesTreso().push({id:'ct_'+Date.now(), categorie:catName, souscategorie:'', recette:true, depense:false, compte:''});
  if (!window._catTreeCollapsed) window._catTreeCollapsed = {};
  window._catTreeCollapsed[catName] = false;
  renderCategoriesTreso();
  scheduleSave();
}

function deleteCatGroup(catName) {
  var count = getCategoriesTreso().filter(function(c){return c.categorie===catName;}).length;
  if (count > 1 && !confirm('Supprimer la catégorie "'+catName+'" et ses '+count+' sous-catégories ?')) return;
  db.categoriesTreso = getCategoriesTreso().filter(function(c){return c.categorie!==catName;});
  renderCategoriesTreso();
  scheduleSave();
}

function addCategorieTresoNew() {
  var name = prompt('Nom de la nouvelle catégorie :');
  if (!name || !name.trim()) return;
  name = name.trim();
  getCategoriesTreso().push({id:'ct_'+Date.now(), categorie:name, souscategorie:'', recette:true, depense:false, compte:''});
  if (!window._catTreeCollapsed) window._catTreeCollapsed = {};
  window._catTreeCollapsed[name] = false;
  renderCategoriesTreso();
  scheduleSave();
}

function updateCatTreso(i, key, val) {
  var cats = getCategoriesTreso();
  if (cats[i]) cats[i][key] = val;
  if (key === 'recette' || key === 'depense') renderCategoriesTreso();
  scheduleSave();
}

function deleteCatTreso(i) {
  getCategoriesTreso().splice(i, 1);
  renderCategoriesTreso();
  scheduleSave();
}

function saveCategoriesTreso() {
  // Collecter toutes les valeurs actuelles des inputs dans le DOM
  // avant de sauvegarder, au cas où onchange n'a pas encore été déclenché
  var cats = getCategoriesTreso();

  // Relire les noms de catégories depuis les inputs du header
  var headers = document.querySelectorAll('#categories-treso-tree .cat-tree-group');
  headers.forEach(function(group) {
    var nameInput = group.querySelector('[style*="font-weight:700"]');
    if (!nameInput) return;
    var oldName = nameInput.defaultValue; // valeur initiale
    var newName = nameInput.value.trim();
    if (newName && newName !== oldName) {
      cats.forEach(function(c) { if (c.categorie === oldName) c.categorie = newName; });
    }
  });

  // Relire les sous-catégories depuis les inputs de corps
  var subcatInputs = document.querySelectorAll('#categories-treso-tree .cat-tree-body input[type="text"]');
  subcatInputs.forEach(function(inp) {
    var onch = inp.getAttribute('onchange') || '';
    var m = onch.match(/updateCatTreso\((\d+)/);
    if (m) {
      var idx = parseInt(m[1]);
      if (cats[idx]) cats[idx].souscategorie = inp.value;
    }
  });

  scheduleSave();
  toast('Catégories enregistrées !', 'success');
}

function getCatsRecettesFromDB() {
  var cats = getCategoriesTreso().filter(function(c){return c.recette;});
  var result = [];
  cats.forEach(function(c) {
    var label = c.souscategorie ? (c.categorie + ' / ' + c.souscategorie) : c.categorie;
    if (result.indexOf(label) < 0) result.push(label);
  });
  if (!result.length) return window.CATS_RECETTES || [];
  return result;
}

function getCatsDepensesFromDB() {
  var cats = getCategoriesTreso().filter(function(c){return c.depense;});
  var result = [];
  cats.forEach(function(c) {
    var label = c.souscategorie ? (c.categorie + ' / ' + c.souscategorie) : c.categorie;
    if (result.indexOf(label) < 0) result.push(label);
  });
  if (!result.length) return window.CATS_DEPENSES || [];
  return result;
}

// ── PAIEMENTS DANS LA FICHE ADHÉRENT ──────────────────────────────
function loadFichePaiements() {
  // Called when fiche tab-paiement is shown
  var el = document.getElementById('fiche-paiements-list'); if (!el) return;
  var btnAdd = document.getElementById('fiche-add-paiement-btn');
  var id = editingId; // global from fiche
  var a = id ? db.adherents.find(function(x){return x.id===id;}) : null;
  if (!a) { el.innerHTML = '<span style="color:var(--gray)">Enregistrez d\'abord cet adhérent.</span>'; return; }

  // ── CAS : membre rattaché à un chef de famille ──────────────────
  if (isMembreFamille(a)) {
    if (btnAdd) btnAdd.style.display = 'none';
    var chef = db.adherents.find(function(x){ return x.id === a.chef_famille; });
    el.innerHTML =
      '<div style="background:rgba(37,99,235,0.06);border:1px solid rgba(37,99,235,0.2);border-radius:10px;padding:16px;font-size:13px;color:#1d4ed8;text-align:center">' +
        '<div style="font-size:22px;margin-bottom:8px"><i class="ti ti-crown" aria-hidden="true"></i></div>' +
        '<div style="font-weight:700;font-size:14px;margin-bottom:6px">Paiement géré par le chef de famille</div>' +
        '<div style="color:var(--gray);margin-bottom:12px">Les paiements de cet adhérent sont pris en charge par <strong>' + (chef ? chef.prenom + ' ' + chef.nom : 'le chef de famille') + '</strong>.</div>' +
        (chef ? '<button class="btn btn-secondary btn-sm" onclick="ouvrirFicheExistante(\''+chef.id+'\')">Ouvrir la fiche de ' + chef.prenom + ' ' + chef.nom + '</button>' : '') +
      '</div>';
    return;
  }

  // ── CAS NORMAL et CHEF DE FAMILLE ──────────────────────────────
  if (btnAdd) btnAdd.style.display = '';

  var paiements = (a.paiements||[]).slice().sort(function(x,y){
    return (y.dateReception||y.datePaiement||'').localeCompare(x.dateReception||x.datePaiement||'');
  });
  var c = payCalc(a); // inclut les membres si chef

  // Mini synthèse
  var synthHtml = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:14px">';
  synthHtml += '<div style="background:var(--bg);border-radius:var(--radius);padding:10px;text-align:center"><div style="font-size:10px;color:var(--gray);font-weight:700;text-transform:uppercase;margin-bottom:4px">À régler</div><div style="font-size:16px;font-weight:800">' + c.montant.toFixed(2) + ' €</div></div>';
  synthHtml += '<div style="background:rgba(22,163,74,0.06);border-radius:var(--radius);padding:10px;text-align:center"><div style="font-size:10px;color:var(--gray);font-weight:700;text-transform:uppercase;margin-bottom:4px">Réglé</div><div style="font-size:16px;font-weight:800;color:var(--success)">' + c.verse.toFixed(2) + ' €</div></div>';
  synthHtml += '<div style="background:rgba(' + (c.reste>0?'220,38,38':'22,163,74') + ',0.06);border-radius:var(--radius);padding:10px;text-align:center"><div style="font-size:10px;color:var(--gray);font-weight:700;text-transform:uppercase;margin-bottom:4px">Reste</div><div style="font-size:16px;font-weight:800;color:' + (c.reste>0?'var(--danger)':'var(--success)') + '">' + c.reste.toFixed(2) + ' €</div></div>';
  synthHtml += '</div>';

  // Si chef de famille : afficher le détail des cotisations des membres
  if (a.famille_lien === 'chef') {
    var membres = db.adherents.filter(function(x){ return x.chef_famille === a.id; });
    if (membres.length) {
      synthHtml += '<div style="background:rgba(37,99,235,0.04);border:1px solid rgba(37,99,235,0.15);border-radius:8px;padding:10px 14px;font-size:12px;margin-bottom:14px">';
      synthHtml += '<div style="font-weight:700;font-size:11px;text-transform:uppercase;color:#1d4ed8;letter-spacing:0.05em;margin-bottom:8px"><i class="ti ti-crown" aria-hidden="true"></i> Détail cotisations famille</div>';
      synthHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--bg3)"><span>' + a.prenom + ' ' + a.nom + ' <em style="color:var(--gray)">(chef)</em></span><span>' + parseFloat(a.montant||0).toFixed(2) + ' €</span></div>';
      membres.forEach(function(m) {
        synthHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--bg3)"><span>' + m.prenom + ' ' + m.nom + '</span><span>' + parseFloat(m.montant||0).toFixed(2) + ' €</span></div>';
      });
      synthHtml += '<div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700"><span>Total famille</span><span>' + c.montant.toFixed(2) + ' €</span></div>';
      synthHtml += '</div>';
    }
  }

  if (!paiements.length) {
    el.innerHTML = synthHtml + '<div style="color:var(--gray);font-style:italic;text-align:center;padding:16px 0">Aucun paiement enregistré</div>';
    return;
  }

  var listHtml = paiements.map(function(p) {
    var isAuto = getPayModesAuto().indexOf(p.type) >= 0;
    return '<div style="background:var(--bg);border-radius:var(--radius);padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;border:1px solid var(--bg3)">' +
      '<div>' +
        (function(){ var _tp=(db.typesPaiement||[]).find(function(tp){return tp.libelle===p.type;}); var _c=_tp?_tp.couleur:'#636366'; return '<span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;background:'+_c+'20;color:'+_c+';border:1px solid '+_c+'40">'+( p.type||'—')+'</span>'; })() +
        (p.echeance ? ' <span style="font-size:10px;color:var(--info)">Éch. ' + p.echeance + '</span>' : '') +
        (isAuto ? ' <span style="font-size:10px;color:var(--info)"><i class="ti ti-bolt" aria-hidden="true"></i></span>' : '') +
        '<div style="font-size:14px;font-weight:700;color:var(--success);margin-top:2px">' + parseFloat(p.montant||0).toFixed(2) + ' €</div>' +
      '</div>' +
      '<div style="text-align:right;font-size:11px;color:var(--gray)">' +
        (p.dateReception ? '<div>Réception : ' + (fmtDate(p.dateReception)||p.dateReception) + '</div>' : '') +
        (p.datePaiement ? '<div>Paiement : ' + (fmtDate(p.datePaiement)||p.datePaiement) + '</div>' : '') +
        (p.reference ? '<div>Réf. : <strong style="color:var(--dark)">' + escHtml(p.reference) + '</strong></div>' : '') +
      '</div>' +
      '<div style="display:flex;gap:4px">' +
        '<button class="btn btn-sm btn-icon" data-faid="' + a.id + '" data-fpid="' + p.id + '" onclick="deletePaiement(this.dataset.faid,this.dataset.fpid);loadFichePaiements()">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');

  el.innerHTML = synthHtml + listHtml;
  loadFicheCautions();
}

function openFicheAddPaiement() {
  var id = editingId;
  if (!id) { toast('Enregistrez d\'abord cet adhérent', 'error'); return; }
  openAddPaiement(id);
  // Override the save to also refresh fiche
  var origSave = window.savePaiementNew;
  // After save, also reload fiche paiements
}

// Hook: after savePaiementNew, refresh fiche if tab is open
// NB : savePaiementNew est asynchrone (enregistrement granulaire) — il faut
// l'attendre et propager son résultat, sinon la fiche se rafraîchirait avant
// la fin de l'écriture et l'appelant perdrait le statut de l'enregistrement.
var _origSavePaiementNew = savePaiementNew;
savePaiementNew = async function() {
  var res = await _origSavePaiementNew();
  // Also refresh fiche paiements if visible
  var ficheSection = document.getElementById('fiche-paiements-list');
  if (ficheSection && ficheSection.closest && ficheSection.closest('[style*="display:none"]') === null) {
    setTimeout(loadFichePaiements, 100);
  }
  return res;
};

// ── ESSAI ─────────────────────────────────────────────────────────
function toggleEssaiFields() {
  var cb = document.getElementById('f_essai');
  var det = document.getElementById('essai-details');
  if (!cb || !det) return;
  det.style.display = cb.checked ? 'grid' : 'none';
  // Auto-fill start date if empty
  if (cb.checked && !document.getElementById('f_essai_debut').value) {
    document.getElementById('f_essai_debut').value = today();
    calcEssaiFin();
  }
}

function calcEssaiFin() {
  var debutEl = document.getElementById('f_essai_debut');
  var finEl = document.getElementById('f_essai_fin');
  if (!debutEl || !finEl || !debutEl.value) return;
  var d = new Date(debutEl.value);
  d.setDate(d.getDate() + 21); // 3 semaines = 21 jours
  finEl.value = d.toISOString().split('T')[0];
  onFicheChange();
}

function essaiBadge(a) {
  if (!a.essai) return '';
  var statut = a.essai_statut || 'en_cours';
  var finStr = a.essai_fin ? ' · fin ' + (fmtDate(a.essai_fin)||a.essai_fin) : '';
  if (statut === 'transforme') return '<span class="badge badge-success" style="font-size:10px"><i class="ti ti-circle-check" aria-hidden="true"></i> Essai → Adhésion</span>';
  if (statut === 'annule') return '<span class="badge badge-danger" style="font-size:10px"><i class="ti ti-circle-x" aria-hidden="true"></i> Essai annulé</span>';
  // en_cours
  var fin = a.essai_fin ? new Date(a.essai_fin) : null;
  var now = new Date();
  var expColor = (fin && fin < now) ? 'badge-danger' : 'badge-warn';
  var expTxt = (fin && fin < now) ? '<i class="ti ti-alert-triangle" aria-hidden="true"></i> Essai expiré' : '<i class="ti ti-clock" aria-hidden="true"></i> En essai';
  return '<span class="badge ' + expColor + '" style="font-size:10px">' + expTxt + finStr + '</span>';
}


// ── GESTION MEMBRES COURS ─────────────────────────────────────────
function ouvrirModalAjoutMembre(coursId) {
  var cours = (db.cours||[]).find(function(c){return c.id===coursId;});
  if (!cours) return;
  var tc = (db.typesCours||[]).find(function(t){return t.id===cours.type_cours_id;});
  var maxPlaces = (tc&&tc.placesMax) ? tc.placesMax : (cours.max||0);
  var nbInscrits = db.adherents.filter(function(a){var e=_getCoursEntry(a,coursId);return e&&!e.attente;}).length;
  var dejaDans = db.adherents.filter(function(a){return _getCoursEntry(a,coursId)!==null;}).map(function(a){return a.id;});
  var _saisonCourante = typeof currentSaison === 'function' ? currentSaison() : (db.currentSaison||'');
  var dispo = db.adherents.filter(function(a){
    if(_saisonCourante && a.saison && a.saison !== _saisonCourante) return false;
    return dejaDans.indexOf(a.id)<0 && (!a.cours_inscrits||a.cours_inscrits.length<3);
  });
  dispo.sort(function(a,b){return (a.nom+a.prenom).localeCompare(b.nom+b.prenom);});
  var opts = '<option value="">— Sélectionner un adhérent —</option>';
  dispo.forEach(function(a){
    opts += '<option value="'+a.id+'">'+a.nom+' '+a.prenom+(a.catage?' · '+a.catage:'')+'</option>';
  });
  var placesTxt = maxPlaces > 0
    ? '<div style="font-size:12px;background:var(--bg);border-radius:var(--radius);padding:8px 12px;margin-bottom:14px">'+
        'Cours : <strong>'+(cours.nom||'')+'</strong> · '+
        (nbInscrits>=maxPlaces
          ? '<span style="color:var(--danger);font-weight:600">⛔ Complet ('+nbInscrits+'/'+maxPlaces+')</span>'
          : '<span style="color:var(--success);font-weight:600">'+nbInscrits+'/'+maxPlaces+' inscrits — '+(maxPlaces-nbInscrits)+' place(s) disponible(s)</span>')+
      '</div>'
    : '';
  var body = placesTxt +
    '<div class="field"><label>Adhérent *</label><select id="am_adherent">'+opts+'</select></div>'+
    '<div style="margin-top:10px;padding:10px;background:#D9770610;border-radius:var(--radius);border:1px solid #D9770630">'+
      '<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">'+
        '<input type="checkbox" id="am_attente" style="width:16px;height:16px;accent-color:#D97706">'+
        '<span><strong style="color:#D97706"><i class="ti ti-clock" aria-hidden="true"></i> Mettre en liste d\'attente</strong> <span style="font-size:11px;color:var(--gray)">(non comptabilisé dans le groupe)</span></span>'+
      '</label>'+
    '</div>';
  window._ajoutMembreCoursId = coursId;
  openModal('Ajouter un adhérent au cours', body, [
    {label:'Annuler', cls:'btn-secondary', action:'closeModal()'},
    {label:'Ajouter', cls:'btn-primary', action:'ajouterMembreCours()'}
  ]);
}

function ajouterMembreCours() {
  var coursId = window._ajoutMembreCoursId;
  var adherentId = document.getElementById('am_adherent').value;
  var enAttente = document.getElementById('am_attente') && document.getElementById('am_attente').checked;
  if (!adherentId) { toast('Sélectionnez un adhérent', 'error'); return; }
  var a = db.adherents.find(function(x){return x.id===adherentId;});
  if (!a) return;
  if(!a.cours_inscrits)a.cours_inscrits=[];
  a.cours_inscrits.push({coursId:coursId, attente:!!enAttente});
  a.typecours = a.cours_inscrits[0].coursId;
  a.attenteCours = !!a.cours_inscrits[0].attente;
  scheduleSave(); closeModal(); renderGroupes();
  toast(a.prenom+' '+a.nom+(enAttente?' mis(e) en liste d\'attente !':' ajouté(e) au cours !'), 'success');
}

function promouvoirAttente(coursId, adherentId) {
  var a = db.adherents.find(function(x){return x.id===adherentId;});
  if (!a) return;
  openConfirmModal('Inscrire depuis la liste d\'attente',
    'Inscrire <strong>'+a.prenom+' '+a.nom+'</strong> dans le cours (retirer de la liste d\'attente) ?',
    function() {
      var entry=(a.cours_inscrits||[]).find(function(e){return e.coursId===coursId;});
      if(entry)entry.attente=false;
      a.attenteCours = false;
      scheduleSave(); renderGroupes();
      toast(a.prenom+' '+a.nom+' inscrit(e) dans le cours ✅', 'success');
    }
  );
}

function retirerAdherentCours(coursId, adherentId) {
  var a = db.adherents.find(function(x){return x.id===adherentId;});
  if (!a) return;
  openConfirmModal('Retirer du cours',
    'Retirer <strong>'+a.prenom+' '+a.nom+'</strong> de ce cours ?',
    function() {
      a.cours_inscrits=(a.cours_inscrits||[]).filter(function(e){return e.coursId!==coursId;});
      var _first=a.cours_inscrits[0]||null;
      a.typecours=_first?_first.coursId:'';
      a.attenteCours=!!(_first&&_first.attente);
      scheduleSave(); renderGroupes();
      toast(a.prenom+' '+a.nom+' retiré(e) du cours', 'error');
    }
  );
}



// ── FONCTIONS CHAMPIONNAT MANQUANTES ─────────────────────────────
function openAddJoueurEquipe(equipeId) {
  var champ = currentChamp(); if (!champ) return;
  window._champAddEqId = equipeId;
  var eq = (champ.equipes||[]).find(function(e) { return e.id === equipeId; });
  if (!eq) return;

  var eqSexe = eq.sexe || 'Mixte';
  var dejaDans = (eq.joueurs||[]).map(function(j) { return j.adherentId; });

  // Filtrer depuis joueursInscrits
  var dispo = (champ.joueursInscrits||[]).filter(function(j) {
    if (dejaDans.indexOf(j.adherentId) >= 0) return false;
    var a = db.adherents.find(function(x) { return x.id === j.adherentId; });
    if (!a) return false;
    if (!sexeCompatible(eqSexe, a.sexe)) return false;
    // Filtre âge tennis
    var age = calcAge(a.ddn);
    if (age !== null) {
      if ((eq.ageMin||0) > 0 && age < eq.ageMin) return false;
      if ((eq.ageMax||99) < 99 && age > eq.ageMax) return false;
    }
    return true;
  });
  var opts = '<option value="">— Sélectionner —</option>';
  if (dispo.length === 0) {
    opts = '<option value="">⚠️ Aucun joueur éligible (' + eqSexe + ')</option>';
  } else {
    dispo.forEach(function(j) {
      var a = db.adherents.find(function(x) { return x.id === j.adherentId; });
      if (a) {
        opts += '<option value="' + a.id + '">' + a.nom + ' ' + a.prenom +
          ' — ' + (j.classement || a.classement || 'N/C') +
          ' · ' + (a.sexe === 'M' ? '♂' : a.sexe === 'F' ? '♀' : a.sexe || '?') + '</option>';
      }
    });
  }

  var criteres = '<strong>' + eqSexe + '</strong>';
  if ((eq.ageMin||0) > 0 || (eq.ageMax||99) < 99) {
    criteres += ' · <strong>' + (eq.ageMin||0) + '–' + (eq.ageMax||99) + ' ans</strong>';
  }

  var body =
    '<div style="background:var(--bg);border-radius:8px;padding:8px 12px;margin-bottom:14px;font-size:12px;color:var(--gray)">Critères : ' + criteres + '</div>' +
    '<div class="form-grid">' +
    '<div class="field form-full"><label>Joueur</label>' +
    '<select id="aje_joueur">' + opts + '</select></div>' +
    '<div class="field"><label>Classement</label>' +
    '<input type="text" id="aje_class" placeholder="Ex: 15/3"></div>' +
    '<div class="field"><label>Rôle</label>' +
    '<select id="aje_cap"><option value="">Joueur</option><option value="1">Capitaine</option></select>' +
    '</div></div>';

  openModal('Ajouter joueur — ' + eq.nom, body, [
    {label: 'Annuler', cls: 'btn-secondary', action: 'closeModal()'},
    {label: 'Ajouter', cls: 'btn-primary', action: 'addJoueurEquipe()'}
  ]);
}

function addJoueurEquipe() {
  var champ = currentChamp(); if (!champ) return;
  var equipeId = window._champAddEqId;
  var eq = (champ.equipes||[]).find(function(e) { return e.id === equipeId; }); if (!eq) return;
  var id = document.getElementById('aje_joueur').value;
  if (!id) { toast('Sélectionnez un joueur', 'error'); return; }
  var a = db.adherents.find(function(x) { return x.id === id; });
  if (!sexeCompatible(eq.sexe, a ? a.sexe : '')) {
    toast('Ce joueur ne respecte pas le critère sexe de l\'équipe', 'error'); return;
  }
  if (!eq.joueurs) eq.joueurs = [];
  var classement = document.getElementById('aje_class').value || (a ? a.classement : '') || '';
  var cap = document.getElementById('aje_cap').value === '1';
  eq.joueurs.push({ adherentId: id, classement: classement, capitaine: cap });
  scheduleSave(); closeModal(); renderEquipes(); renderChampVue();
  toast('Joueur ajouté !', 'success');
}

function exportChampCSV() {
  var champ = currentChamp();
  if (!champ) { toast('Sélectionnez un championnat', 'error'); return; }
  var equipes = champ.equipes || [];

  // Trier les joueurs de chaque équipe comme à l'écran
  var equipesTriees = equipes.map(function(e) {
    var jt = (e.joueurs||[]).slice().sort(function(a,b) {
      if (a.capitaine && !b.capitaine) return -1;
      if (!a.capitaine && b.capitaine) return 1;
      var ca = a.classement || (db.adherents.find(function(x){return x.id===a.adherentId;})||{}).classement || '';
      var cb = b.classement || (db.adherents.find(function(x){return x.id===b.adherentId;})||{}).classement || '';
      return compareClassement(ca, cb);
    });
    return Object.assign({}, e, {joueurs: jt});
  });

  // Collecter et trier les week-ends par journée
  var allWeeks = [];
  equipesTriees.forEach(function(e) {
    (e.rencontres||[]).forEach(function(r) {
      var w = r.weekend || r.date || '?';
      if (allWeeks.indexOf(w) < 0) allWeeks.push(w);
    });
  });
  allWeeks.sort(function(a, b) {
    var ja = 999, jb = 999;
    equipesTriees.forEach(function(e) {
      (e.rencontres||[]).forEach(function(r) {
        if ((r.weekend||r.date||'?') === a && r.journee) ja = Math.min(ja, parseInt(r.journee)||999);
        if ((r.weekend||r.date||'?') === b && r.journee) jb = Math.min(jb, parseInt(r.journee)||999);
      });
    });
    if (ja !== jb) return ja - jb;
    return a.localeCompare(b);
  });

  // === Styles ===
  var styleTitre    = { font:{bold:true,sz:14,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1E293B'}}, alignment:{horizontal:'center'} };
  var styleSousTitre= { font:{sz:11,color:{rgb:'64748B'}}, fill:{fgColor:{rgb:'F1F5F9'}} };
  var styleSectionH = { font:{bold:true,sz:12,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'C0392B'}}, alignment:{horizontal:'left'} };
  var styleEqHeader = function(sexe) {
    var bg = sexe==='Femmes' ? 'BE185D' : sexe==='Hommes' ? '1D4ED8' : '374151';
    return { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:bg}}, alignment:{horizontal:'center',wrapText:true} };
  };
  var styleSubHeader= { font:{bold:true,sz:10,color:{rgb:'94A3B8'}}, fill:{fgColor:{rgb:'F8FAFC'}}, alignment:{horizontal:'center'} };
  var styleWeekend  = { font:{bold:true,sz:10}, fill:{fgColor:{rgb:'F1F5F9'}}, alignment:{horizontal:'center',vertical:'center'} };
  var styleCell     = { font:{sz:10}, alignment:{horizontal:'left',wrapText:true,vertical:'center'} };
  var styleCellAlt  = { font:{sz:10}, fill:{fgColor:{rgb:'F8FAFC'}}, alignment:{horizontal:'left',wrapText:true,vertical:'center'} };
  var styleBilan    = { font:{bold:true,sz:10}, fill:{fgColor:{rgb:'FEF3C7'}}, alignment:{horizontal:'center'} };
  var styleBilanLbl = { font:{bold:true,sz:10}, fill:{fgColor:{rgb:'FEF3C7'}}, alignment:{horizontal:'left'} };
  var styleJoueur   = function(row) { return row%2===0 ? styleCell : styleCellAlt; };
  var styleJoueurLbl= { font:{bold:true,sz:10,color:{rgb:'94A3B8'}}, fill:{fgColor:{rgb:'F1F5F9'}}, alignment:{horizontal:'left'} };
  var styleCap      = { font:{bold:true,sz:10}, fill:{fgColor:{rgb:'FEF9C3'}}, alignment:{horizontal:'center',wrapText:true} };

  function cell(v, s) { return { v: v||'', t:'s', s: s||styleCell }; }
  function empty(s)   { return { v:'', t:'s', s: s||styleCell }; }

  var aoa = []; // array of arrays of cell objects

  // === TITRE ===
  var titreRow = [cell('CHAMPIONNAT ' + champ.nom.toUpperCase() + (champ.saison?' — '+champ.saison:''), styleTitre)];
  for (var i=0;i<equipes.length;i++) titreRow.push(empty(styleTitre));
  aoa.push(titreRow);

  var sousRow = [cell('Du '+(fmtDate(champ.dateDebut)||'?')+' au '+(fmtDate(champ.dateFin)||'?')+'  ·  '+equipes.length+' équipe(s)', styleSousTitre)];
  for (var i=0;i<equipes.length;i++) sousRow.push(empty(styleSousTitre));
  aoa.push(sousRow);

  aoa.push([]); // ligne vide

  // === SECTION RÉSULTATS ===
  var secRow1 = [cell('🏆 RÉSULTATS DES RENCONTRES', styleSectionH)];
  for (var i=0;i<equipes.length;i++) secRow1.push(empty(styleSectionH));
  aoa.push(secRow1);

  // En-tête équipes
  var hRow = [cell('Week-end / Journée', styleSubHeader)];
  equipesTriees.forEach(function(e) {
    var s = styleEqHeader(e.sexe||'');
    hRow.push(cell(e.nom + (e.division?' — '+e.division:'') + (e.poule?' — '+e.poule:''), s));
  });
  aoa.push(hRow);

  // Capitaines
  var capRow = [cell('Capitaine', styleSubHeader)];
  equipesTriees.forEach(function(e) {
    var cap = (e.joueurs||[]).find(function(j){return j.capitaine;});
    var txt = cap ? champNomAdherent(cap.adherentId) + (cap.classement ? ' ('+cap.classement+')' : '') : '—';
    capRow.push(cell(txt, styleCap));
  });
  aoa.push(capRow);

  // Rencontres par week-end
  allWeeks.forEach(function(week, wi) {
    var s = wi%2===0 ? styleCell : styleCellAlt;
    var row = [cell(week, styleWeekend)];
    equipesTriees.forEach(function(e) {
      var r = (e.rencontres||[]).find(function(rr){ return (rr.weekend||rr.date||'?')===week; });
      if (!r) { row.push(empty(s)); return; }
      var txt = '';
      if (r.journee) txt += 'J'+r.journee+' ';
      txt += (r.adversaire||'');
      txt += r.domicile ? ' 🏠' : ' ✈️';
      if (r.score) txt += '  ' + r.score;
      row.push(cell(txt, s));
    });
    aoa.push(row);
  });

  // Bilan
  var bilanRow = [cell('Bilan', styleBilanLbl)];
  equipesTriees.forEach(function(e) {
    var played = (e.rencontres||[]).filter(function(r){return r.score;});
    var v=0,d=0,n=0;
    played.forEach(function(r){
      var res = scoreResult(r.score);
      if (res==='success') v++; else if (res==='danger') d++; else n++;
    });
    bilanRow.push(cell(v+'V  '+d+'D'+(n?'  '+n+'N':''), styleBilan));
  });
  aoa.push(bilanRow);

  aoa.push([]); // ligne vide

  // === SECTION COMPOSITION ===
  var secRow2 = [cell('👥 COMPOSITION DES ÉQUIPES', styleSectionH)];
  for (var i=0;i<equipes.length;i++) secRow2.push(empty(styleSectionH));
  aoa.push(secRow2);

  var eqHRow = [cell('Joueurs', styleJoueurLbl)];
  equipesTriees.forEach(function(e) { eqHRow.push(cell(e.nom, styleEqHeader(e.sexe||''))); });
  aoa.push(eqHRow);

  var maxJ = 0;
  equipesTriees.forEach(function(e){ if ((e.joueurs||[]).length > maxJ) maxJ = e.joueurs.length; });
  for (var r=0; r<maxJ; r++) {
    var jRow = [empty(styleJoueurLbl)];
    equipesTriees.forEach(function(e) {
      var j = (e.joueurs||[])[r];
      if (!j) { jRow.push(empty(styleJoueur(r))); return; }
      var a = db.adherents.find(function(x){return x.id===j.adherentId;});
      var txt = a ? a.nom+' '+a.prenom : '?';
      var cl = j.classement||(a?a.classement:'')||'';
      if (cl) txt += '  '+cl;
      if (j.capitaine) txt += '  👑';
      jRow.push(cell(txt, styleJoueur(r)));
    });
    aoa.push(jRow);
  }

  // === GÉNÉRATION XLSX ===
  var ws = XLSX.utils.aoa_to_sheet(aoa.map(function(row){ return row.map(function(c){ return c.v||''; }); }));

  // Appliquer les styles cellule par cellule
  aoa.forEach(function(row, ri) {
    row.forEach(function(c, ci) {
      if (!c || !c.s) return;
      var ref = XLSX.utils.encode_cell({r:ri, c:ci});
      if (!ws[ref]) ws[ref] = {v:c.v||'',t:'s'};
      ws[ref].s = c.s;
    });
  });

  // Largeurs colonnes
  var cols = [{wch:22}];
  equipesTriees.forEach(function(){ cols.push({wch:28}); });
  ws['!cols'] = cols;

  // Hauteurs lignes (section headers plus hauts)
  var rowHeights = aoa.map(function(row, ri) {
    if (row.length > 0 && row[0] && row[0].s === styleSectionH) return {hpt:22};
    if (ri === 0) return {hpt:26};
    return {hpt:18};
  });
  ws['!rows'] = rowHeights;

  // Fusionner les cellules de titre et section
  var merges = [];
  var ncols = equipes.length + 1;
  aoa.forEach(function(row, ri) {
    if (row.length > 0 && row[0] && (row[0].s === styleTitre || row[0].s === styleSousTitre || row[0].s === styleSectionH)) {
      if (ncols > 1) merges.push({s:{r:ri,c:0}, e:{r:ri,c:ncols-1}});
    }
  });
  ws['!merges'] = merges;

  var range = XLSX.utils.decode_range(ws['!ref']||'A1');
  range.e.c = Math.max(range.e.c, ncols-1);
  ws['!ref'] = XLSX.utils.encode_range(range);

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Championnat');

  // Feuille Composition séparée
  var ws2 = XLSX.utils.aoa_to_sheet(
    [['Joueurs'].concat(equipesTriees.map(function(e){return e.nom;}))].concat(
      (function(){
        var rows2 = [];
        for (var r=0;r<maxJ;r++) {
          var row2 = [''];
          equipesTriees.forEach(function(e){
            var j=(e.joueurs||[])[r];
            if (!j){row2.push('');return;}
            var a=db.adherents.find(function(x){return x.id===j.adherentId;});
            var cl=j.classement||(a?a.classement:'')||'';
            row2.push((a?a.nom+' '+a.prenom:'?')+(cl?' ('+cl+')':'')+(j.capitaine?' Cap.':''));
          });
          rows2.push(row2);
        }
        return rows2;
      })()
    )
  );
  XLSX.utils.book_append_sheet(wb, ws2, 'Composition');

  XLSX.writeFile(wb, 'Championnat_' + champ.nom.replace(/[^a-zA-Z0-9]/g,'_') + '.xlsx');
  toast('Export Excel téléchargé !', 'success');
}

function toggleCapitaine(equipeId, adherentId) {
  var champ = currentChamp(); if (!champ) return;
  var eq = (champ.equipes||[]).find(function(e) { return e.id === equipeId; }); if (!eq) return;
  var j = (eq.joueurs||[]).find(function(jj) { return jj.adherentId === adherentId; }); if (!j) return;
  // Si déjà capitaine → retirer; sinon → nommer (et retirer l'ancien cap)
  if (j.capitaine) {
    j.capitaine = false;
    toast('Capitaine retiré', 'error');
  } else {
    (eq.joueurs||[]).forEach(function(jj) { jj.capitaine = false; }); // un seul cap
    j.capitaine = true;
    var a = db.adherents.find(function(x) { return x.id === adherentId; });
    toast((a ? a.nom + ' ' + a.prenom : 'Joueur') + ' nommé capitaine !', 'success');
  }
  scheduleSave();
  renderEquipes();
}

function retirerJoueurEquipe(equipeId, adherentId) {
  var champ = currentChamp(); if (!champ) return;
  var eq = (champ.equipes||[]).find(function(e) { return e.id === equipeId; }); if (!eq) return;
  var a = db.adherents.find(function(x) { return x.id === adherentId; });
  var nom = a ? a.nom + ' ' + a.prenom : 'ce joueur';
  openConfirmModal(
    'Retirer de l\'équipe',
    'Retirer <strong>' + nom + '</strong> de l\'équipe <strong>' + eq.nom + '</strong> ?<br><small style="color:var(--gray)">Il restera inscrit au championnat.</small>',
    function() {
      eq.joueurs = (eq.joueurs||[]).filter(function(j) { return j.adherentId !== adherentId; });
      scheduleSave();
      renderEquipes();
      toast(nom + ' retiré de l\'équipe', 'error');
    }
  );
}

function afficherFicheJoueur(adherentId) {
  var a = db.adherents.find(function(x) { return x.id === adherentId; });
  if (!a) return;
  var age = calcAge(a.ddn);
  var body =
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">' +
    '<div class="avatar" style="width:48px;height:48px;font-size:18px">' + champInitials(adherentId) + '</div>' +
    '<div><div style="font-size:17px;font-weight:700">' + a.prenom + ' ' + a.nom + '</div>' +
    '<div style="font-size:13px;color:var(--gray)">' + (a.catage||'') + (a.pratique ? ' · ' + a.pratique : '') + '</div>' +
    '</div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px">' +
    '<div class="detail-row" style="grid-column:1/-1"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Naissance</span><span>' + (fmtDate(a.ddn)||'—') + (age !== null ? ' <strong>(' + age + ' ans)</strong>' : '') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Sexe</span><span>' + (a.sexe||'—') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Classement</span><span class="classement-badge">' + (a.classement||'—') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Email</span><span style="font-size:12px">' + (a.email||'—') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Téléphone</span><span>' + (a.tel||'—') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">N° FFT</span><span>' + (a.fft||'—') + '</span></div>' +
    '<div class="detail-row"><span class="lbl" style="color:var(--gray);font-size:11px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600">Niveau</span><span>' + (a.niveau||'—') + '</span></div>' +
    '</div>' +
    '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--bg3);display:flex;gap:8px">' +
    '<button class="btn btn-secondary" onclick="ouvrirFicheExistante(\'' + a.id + '\');closeModal()"><i class="ti ti-edit" aria-hidden="true"></i> Ouvrir la fiche complète</button>' +
    '</div>';

  openModal(a.prenom + ' ' + a.nom, body, [
    {label:'Fermer', cls:'btn-secondary', action:'closeModal()'}
  ]);
}


// ═══════════════════════════════════════════════════════════════