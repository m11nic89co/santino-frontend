# Репозитории SANTINO (как не путаться)

## `santino-frontend` (этот репозиторий)

- **Роль:** единственное место с **исходниками** — правки кода, PR, тесты.
- **Деплой:** при push в `main` GitHub Actions собирает Vite с `VITE_BASE=/santino-frontend/` и публикует на **GitHub Pages** как стенд:  
  `https://m11nic89co.github.io/santino-frontend/`
- **Workflow:** `.github/workflows/deploy.yml`

## `santino.com.ru` (отдельный репозиторий)

- **Роль:** только **готовый статический сайт** (содержимое `dist`), без исходников — удобно для продакшена и кастомного домена.
- **Содержимое:** обновляется **только из CI** этого репозитория; руками в прод-репо не коммитим.
- **Деплой:** вручную — **Actions → Deploy santino.com.ru (production) → Run workflow**.  
  Сборка с `VITE_BASE=/`, затем push в `m11nic89co/santino.com.ru` на ветку `main`.
- **Workflow:** `.github/workflows/deploy-santino-com-ru.yml`
- **Секрет:** в настройках **santino-frontend** → Settings → Secrets → `SANTINO_COM_RU_DEPLOY_TOKEN` — Personal Access Token (classic) с правом `repo`, чтобы Actions мог пушить в `santino.com.ru`.

## Домен и GitHub Pages

1. В репозитории **santino.com.ru**: Settings → Pages → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.
2. Там же: Custom domain **santino.com.ru**, включить **Enforce HTTPS** (после проверки DNS).
3. DNS у регистратора: как в подсказке GitHub (обычно **CNAME** на `m11nic89co.github.io`).

## Кратко

| Где правим код | Куда смотрит прод |
|----------------|-------------------|
| `santino-frontend` | После ручного запуска workflow → `santino.com.ru` → сайт на **santino.com.ru** |
