<h1 align="center">
 <br>
  <a href="https://github.com/peterhanania"><img src="https://394wkx-3000.csb.app//thumbnail.png"></a>
  <br>
  Pogy the Discord Bot [DJS V13]
 <br>
</h1>

<h3 align=center>W pełni customizowany bot zbudowany z 147 komenami, 11 kategoriami i dashboardem w bibliotece discord.js v13</h3>

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
  <a href="#pogy">Pogy</a></a>
  •
  <a href="#funkcje">Funkcje</a>
  •
  <a href="#instalacja">Instalowanie</a>
  •
  <a href="#konfiguracja">Konfiguracja</a>
  •
  <a href="#licencja">Licencja</a>
  •
  <a href="#wesprzyj">Wesprzyj</a>
  •
  <a href="#autorzy">Autorzy</a>
</p>

## Pogy

Pogy to bot discord, który jest tworzony od 2 lat. Kod był zepsuty, więc postanowiliśmy naprawić błędy i zrobić z niego wielofunkcyjnego bota w bibliotece discord.js v13! Kliknij [tutaj](https://394wkx-3000.csb.app//invite) aby zaprosić oficjalnego bota na swój serwer! Również możesz dołączyć na officjalny [Serwer wspracia Pogy](https://394wkx-3000.csb.app//support) aby otrzymać pomoc.

Jeżeli spodobało ci się repozytorium, zostaw po sobie gwiazdke ⭐

## Funkcje

**147** komend i **11** różnych kategorii!

- **alt detector:** Blokuje multikonta.
- **applications:** Zarządzaj aplikacjami z dashboardu
- **config:** Skonfiguruj ustawienia serwera
- **utility:** Pare pomocnych komend
- **economy:** Zaczęte ale nie dokończone. (w trakcie prac)
- **fun:** Dużo komend aby utrzymać twój serwer aktywnym
- **images:** Komendy ze obrazkami
- **information:** Komendy informacyjne
- **moderation:** Komendy moderacyjne do moderowania twojego serwera.
- **reaction roles:** Reaction roles
- **tickets:** System ticketów.

- Pogy posiada następujące funckje na stronie

- **Zapisy ticketów** + **Zapisy aplikacji**
- **Kontakt & Zgłoszenia**
- **Powitalne wiadomości** i **Pożegnalne wiadomośći** z opcją embedów.
- W pełni customizowany **Log system** i **moderacja**
- W pełni customizowany **Suggestie** i **Reporty serwerowe**
- Wbudowany **system Premium**
- Wbudowany system konserwacji
- Strona użytkowników
- Automatyczna moderacja, Levele, i Komendy ( nie dokończone )
- Wbudowane api TOP.GG

 <h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/On7mMNg.jpg["></a>
</h1>

**Webhooki: (dla developerów)**
Dzięki Pogy możesz nawet zapisywać wszystko za pomocą webhooków bezpośrednio z pliku konfiguracyjnego!

<h1 align="center">
  <a href="https://github.com/peterhanania"><img src="https://i.imgur.com/vbGuLdL.jpg"></a>
</h1>

## Instalacja

Najpierw sklonuj repozytorium:

```
git clone https://github.com/Pogy-Bot/Pogy.git
```

Po sklonowaniu, użyj w konsoli

```
npm install
```

## Konfiguracja

W twoim pliku `config.json` powinieneś uzupełnić:

- "developers": ID użytkowników którzy mogą używać komend właściciela bota [ARRAY],
- "status": Status twojego bota [STRING],
- "discord": Zaproszenie na serwer wspracia twojego bota [STRING],
- "dashboard": Jeśli chcesz włączyć dashboard ["true" / "false"] (STRING),
- "server": ID twojego serwera wsparcia [STRING],
- "prefix": Domyślny prefix bota [STRING],

Webhooki (logi)
- "logs": Webhook URL dla komend,
-  "maintenance_logs": Webhook URL dla statusu konserwacji (jeśli zostanie uruchomiony automatycznie),
-  "ratelimit_logs": Webhook URL dla ratelimitów,
- "blacklist": Webhook URL dla blacklisty,
-  "report": Webhook URL dla reportów,
-  "contact": Webhook URL dla kontaktu,
-  "bugs": Webhook URL dla bugów,
-  "premium": Webhook URL dla premium,
-  "suggestions": Webhook URL dla suggesti,
-  "votes": Webhook URL dla głosów (TOP.GG),
-  "errors": Webhook URL dla błędów,
-  "auth": Webhook URL dla autoryzacji (dashboard),
-  "joinsPublic": Webhook URL do ogłoszenia dołączeń serwerów o dołączeniu na serwer wspracia,
-  "joinsPrivate": Webhook URL do ogłoszenia dołączeń serwerów na twoim prywatnym serwerze,
-  "leavesPublic": Webhook URL do ogłoszenia opuszczenia serwerów na twoim serwerze wspracia,
-  "leavesPrivate": Webhook URL do ogłoszenia opuszczenia serwerów na twoim prywatnym serwerze,
-  "maintenance": Automatycznie włącz konsersacje kiedy twój bot otrzyma rate limity. ["true" / "false"] (STRING),
-  "maintenance_threshold": Liczba wykrytych ratelimitów aby automatycznie właczyć tryb konserwacji [STRING] Rekomendujemy [3-10]. Na przykład: "3",
-  "invite_link": Link do zaporszenia twojego bota,

SEO
-  "enabled": Jesli chcesz włączyć SEO ["true" / "false"] (STRING),
-  "title": Tytuł SEO dla twojej strony [STRING],
-  "description": Opis SEO dla twojej strony [STRING],

##


Twój plik `.env` powinien zawierać

WYMAGANE
- TOKEN=TOKEN TWOJEGO BOTA
- MONGO=URL POŁĄCZENIA Z TWOIM MONGODB
- SESSION_SECRET=RANDOMOWE LITERY CYFRY ITP ABY ZABEZPIECZYĆ SESJE (Ex. 6B4E8&G#%Z&##bqcyEL5)
- AUTH_DOMAIN=Domena autoryzacji (Np. https://394wkx-3000.csb.app/ lub http://localhost:3000) bez slasha na końcu.
- MAIN_CLIENT_ID=ID clienta twojej głównej aplikacji
- AUTH_CLIENT_ID=ID clienta twojej aplikacji uwierzytelniania
- AUTH_CLIENT_SECRET= SECRET key dla twojej aplikacji
- PORT= port dla strony | default=3000

OPTIONAL
- ANALYTICS=Twój kod analityki google,
- GOOGLE_SITE_VERIFICATION=Twój kod weryfiacji strony google,
- DATADOG_API_KEY=Twój klucz dog api,
- DATADOG_API_HOST=Twój host dog api,
- DATADOG_API_PREFIX=Twój prefix dog api,
- DBL_AUTH=Twój klucz autoryzujący DBL



**Callbacki w portalu deweloperskim Discord**
Będzie on składał się z 2 części, wywołania zwrotnego dla głównego identyfikatora klienta, a drugi dla identyfikatora klienta autoryzacji. Zrobiłem to, aby główny klient nie został ograniczony. Możesz użyć tego samego identyfikatora dla main_client_id i auth_client_id i umieścić 3 wywołania zwrotne w tej samej aplikacji.

MAIN CLIENT ID
twojadomena/thanks na przykład: https://394wkx-3000.csb.app//thanks lub http://localhost:3000/thanks
twojadomena/window na przykład: https://394wkx-3000.csb.app//window lub http://localhost:3000/window

AUTH CLIENT ID
twojadomena/callback na przykład: https://394wkx-3000.csb.app//callback lub http://localhost:3000/callback


**TOP.gg**
Aby dodać top.gg do swojej witryny, dodaj `DBL_AUTH` jako klucz dbl api do pliku `.env`. Oraz `twoja_domena/dblwebhook` jako adres URL webhooka w ustawieniach witryny top.gg. Przykład: `https://twojbot.com/dblwebhook`


**Replit**
Aby uruchomić na replicie, musisz zainstalować węzeł js `v.16.9.1`, aby to zrobić, przejdź do bash (terminal bash w twoim replice) i wklej: `npm init -y && npm i --save-dev node@16.9.0 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH`


Upewnij się, że masz włączone „Uprzywilejowane intencje” na swoim Discord [portalu programisty] (https://discordapp.com/developers/applications/). Możesz znaleźć te intencje w sekcji „Bot” i musisz włączyć trzy przyciski. Aby uzyskać więcej informacji o intencjach bramy, kliknij [ten](https://discordjs.guide/popular-topics/intents.html#the-intents-bit-field-wrapper) link.

Możesz uruchomić bota za pomocą `npm start`

**Ważna uwaga:** Zanim dołączysz do serwera pomocy, aby uzyskać pomoc, przeczytaj uważnie przewodnik.

### Emotki

- Emoji możesz zmienić w plikach: <br>
  1- `assets/emojis.json` <br>
  2- `data/emoji.js`

### Kolory

- Kolory możesz zmienić w pliku `data/colors.js`

## Licencja

Wydany na licencji [Apache License](http://www.apache.org/licenses/LICENSE-2.0).

## Wesprzyj

Możesz przekazać Pogy i uczynić ją silniejszą niż kiedykolwiek [klikając tutaj](https://paypal.me/pogybot)!

## Autorzy
[Stare kredyty](https://github.com/peterhanania/pogy#credits)
- Peter Hanania [Przepisyawnie DJS] - [github.com/peterhanania](github.com/peterhanania)
- JANO [Przepisywanie DJS] - [github.com/wlegit](github.com/wlegit)
