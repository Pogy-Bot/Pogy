<h1 align="center">
 <br>
  <a href="https://github.com/peterhanania"><img src="https://pogy.xyz/thumbnail.png"></a>
  <br>
  Pogy el bot de Discordia [DJS V13]
 <br>
</h1>

<h3 align=center>Un bot 100% configurable amb 147 commandaments, 11 categories i un panell utilitzant discord.js v13</h3>

<div align=center>

 <a href="https://github.com/mongodb/mongo">
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white" alt="mongo">
  </a>
  
  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v13.6.0-blue.svg?logo=npm" alt="discordjs">
  </a>

  <a href="https://github.com/peterhanania/Pogy/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache%202-blue" alt="license">
  </a>

</div>

<p align="center">
  <a href="#about">Sobre</a>
  •
  <a href="#features">Característiques</a>
  •
  <a href="#installation">Instalació</a>
  •
  <a href="#setting-up">Preparant</a>
  •
  <a href="#license">Llicència</a>
  •
  <a href="#donate">Dona</a>
  •
  <a href="#credits">Crèdits</a>
</p>

## Sobre

Pogy és un bot de discordia que varem començar fa 2 anys, el codi estaba trencat, així que varem decidir arreglar els errors i fer el bot multiproposit amb discord.js v13! Vosté pot clicar [aquest](https://pogy.xyz/invite) per invitar al bot oficial! D'altre banda, vosté pot entrar al [Servidor d'ajuda oficial](https://pogy.xyz/support) per ajuda.

Si t'ha agradat el repositori, ets lliure de donar-li una estrella. ⭐

## Característiques

**147** comandaments i **11** diferentes categoríes!

- **detector de comptes múltiples:** Bloqueja les comptes múltiples del gremi.
- **aplicacións:** Mangeja les aplicacións desde la pagina web.
- **configuració:** Configura les opcións del servidor.
- **utilitat:** Alguns comandaments d'utilitat.
- **economía:** Començat, perè no fet.
- **diversió:** Una pila de comandaments per fer el vostre gremini divertit!
- **imatges:** Comandaments d'imatges.
- **informació:** Comandaments d'informació
- **moderació:** Comandaments de moderació per vigilar el vostre servidor.
- **rols de reacció:** rols de reacció.
- **bitllets:** Bitllets del gremini per obtenir suport.

Pogy, té les seguents característiques en la pagina web

- **Transcripcións de bitllets** + **Transcipció d'aplicació**
- pagina de **Contacte i informe**
- **Missatges de benvinguda** i **missatges de despedida** incluïnt incrustacións (embeds).
- **Registre** i **moderació** totalment configurables.
- **Sugerencies** i **informes del servidor** totalment configurables.
- Un sistema de **funcións de pagament**
- Un sistema de manteniment
- Una pagina de membres
- Moderació automatica, Nivellatge i comandaments (no fet)
- Utilitzant la API de TOP.gg

 <h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/On7mMNg.jpg["></a>
</h1>

**Webhooks: (per desarrolladors)**
Amb Pogy pots fer registre de tot utilitzant webhooks desde el arxiu de configuració

<h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/vbGuLdL.jpg"></a>
</h1>

## Instalació

Primer clona el repositori:

```
git clone https://github.com/Pogy-Bot/Pogy.git
```

Despres de fer el clonatge, executa

```
npm install
```

## Preparant

El teu `config.json` tindría que serguir

- "developers": Identificació dels desarrolladors que poden utilitzar comandaments del propietari [ARRAY],
- "status": El estat del teu bot [STRING],
- "discord": El servidor de suport del teu bot [STRING],
- "dashboard": Si vols activar la pagina ["true" / "false"] (STRING),
- "server": La identificació del servidor de suport [STRING],
- "prefix": El prefixe per defecte del teu bot [STRING],
  
Webhooks
- "logs": Webhook URL per el registre de comandaments.,
- "maintenance_logs": Webhook URL per el registre de manteniment (si s'activa automàticament),
- "ratelimit_logs": Webhook URL per als registres de límit de velocitat,
- "blacklist": Webhook URL per als registres de la llista negra,
- "report": Webhook URL per registres d'informes,
- "contact": Webhook URL per registres de contacte,
- "bugs": Webhook URL per registre d'errors,
- "premium": Webhook URL per als registres premium,
- "suggestions": Webhook URL per als registres de suggeriments,
- "votes": Webhook URL per als registres de vots,
- "errors": Webhook URL per als registres d'errors,
- "auth": Webhook URL per als registres d'autenticació,
- "joinsPublic": Webhook URL per anunciar les unions del servidor al servidor de suport,
- "joinsPrivate": Webhook URL per anunciar que el servidor s'uneix al vostre servidor privat,
- "leavesPublic": Webhook URL per anunciar les sortides del servidor al servidor de suport,
- "leavesPrivate": Webhook URL per anunciar les sortides del servidor al servidor privat,
- "maintenance": Activa automàticament el mode de manteniment si es limita a la velocitat ["true" / "false"] (STRING),
- "maintenance_threshold": La quantitat d'activadors del límit de velocitat necessaris per habilitar el mode de manteniment [STRING] recomanat [3-10]. Exemple "3",
- "invite_link": La invitació del vostre bot,

SEO
-  "enabled": si voleu habilitar el SEO ["true" / "false"] (STRING),
-  "title": El títol de SEO del vostre lloc web [STRING],
-  "description": Descripció SEO del vostre lloc web [STRING],

##


El teu `.env` tindría que tenir

ELS NECESSITARIS
- TOKEN=EL TEU TOKEN DE BOT
- MONGO=URL DE LA VOSTRA BASE DE DADES MONGO
- SESSION_SECRET=UNA STR ALEATORIA PER A LA SEGURETAT DE LA SESSIÓ (Ex. 6B4E8&G#%Z&##bqcyEL5)
- AUTH_DOMAIN=El vostre domini d'autenticació (Ex. https://pogy.xyz o http://localhost:3000) cap barra al final.
- MAIN_CLIENT_ID=l'identificador de client de la vostra aplicació principal
- AUTH_CLIENT_ID=l'identificador de client de la vostra aplicació d'autenticació
- AUTH_CLIENT_SECRET=el secret del client de la vostra aplicació d'autenticació
- PORT=el port del vostre lloc web | defecte=3000

OPCIONAL
- ANALYTICS=el teu codi de Google Analytics,
- GOOGLE_SITE_VERIFICATION=el vostre codi de verificació del lloc de Google,
- DATADOG_API_KEY=la clau de l'API del vostre datadog,
- DATADOG_API_HOST=el vostre amfitrió de l'API de datadog,
- DATADOG_API_PREFIX=el prefixe de la API de datadog,
- DBL_AUTH=la vostra autorització dbl



**Les devolucions de trucada al portal de desenvolupament de Discordia**
Tindrà 2 parts, una devolució de trucada per a l'ID de client principal i l'altra per a l'ID de client d'autenticació. Ho vaig fer perquè el client principal no es limiti a la tarifa. Podeu utilitzar el mateix identificador per a main_client_id i auth_client_id i posar les 3 devolucions de trucada a la mateixa aplicació.
ID DE CLIENT PRINCIPAL
elteudomini/thanks exemple https://pogy.xyz/thanks o http://localhost:3000/thanks
elteudomini/window exemple https://pogy.xyz/window o http://localhost:3000/window

ID DE CLIENT AUTH
elteudomini/callback exemple https://pogy.xyz/callback o http://localhost:3000/callback


**TOP.gg** 
Per afegir top.gg al vostre lloc, afegiu `DBL_AUTH` com a clau d'API dbl al fitxer `.env`. I `elteudomini/dblwebhook` com a URL de webhook a la configuració del lloc de top.gg. Exemple: `https://yourbot.com/dblwebhook


**Replit**
Per executar-se amb replit, heu d'instal·lar el node js `v.16.9.1` per fer-ho, aneu a bash (el terminal bash de la vostra repl) i enganxeu: `npm init -y && npm i --save-dev node@16.9.0 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH`

Si us plau, assegureu-vos que heu habilitat "Intencions privilegiades" al vostre Discord [developer portal](https://discordapp.com/developers/applications/). Podeu trobar aquestes intencions a la secció "Bot" i hi ha dues marques que heu d'activar. Per obtenir més informació sobre les intencions de passarel·la, consulteu l'enllaç [this](https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper).

Podeu llançar el bot amb `npm start`

**Nota important:** Abans d'unir-vos al servidor d'assistència per obtenir ajuda, llegiu atentament la guia.

### Emoticones

- Pots canviar les emoticones en: <br>
  1- `assets/emojis.json` <br>
  2- `data/emoji.js`

### Colors

- Pots canviar els colors en `data/colors.js`

## Llicència

Alliberat sota la llicència [Apache License](http://www.apache.org/licenses/LICENSE-2.0).

## Donar

Pots donar Pogy i fer-lo més fort que mai [clickant aquí](https://paypal.me/pogybot)!

## Crèdits
[Crèdits antigs](https://github.com/peterhanania/pogy#credits)
- Peter Hanania [DJS Rewrite] - [github.com/peterhanania](github.com/peterhanania)
- JANO [DJS Rewrite] - [github.com/wlegit](github.com/wlegit)
