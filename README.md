# Rendering Optimization of React

Branch で管理されたステップごとに最適化が進んでいきます。

## branch: stap0

カウントアップですべての要素がレンダリングされる。

![step0](https://i.gyazo.com/40c73c3d33b9d92c56e6dff8d79c0ea9.gif)

## branch: step1

React.memo でコンポーネントをメモ化  
アロー関数を持つ DisplayFunction 以外は不要なレンダリングを抑制できている。

![step1](https://i.gyazo.com/f56cecda3727d1605ccd40efe15a7f01.gif)

## branch: step2

`useCallback` でアロー関数をメモ化。  
オブジェクトや配列を持つ場合は更新用の関数も状態に依存するため関数も更新される。

![step2](https://i.gyazo.com/66b6e9748817a35e68037ee66dac64c3.gif)

## branch: step3

Recoil で状態をグローバルに管理して Props のバケツリレーを減らす。  
`useCount` の custom hooks にまとめると Atom を Subscribe してしまうため、不要なレンダリングがまた復活してしまっている。  
Recoil の useCallback 版である useRecoilCallback で setter を囲むも残念ながら不要なレンダリングが残る。

![step3](https://i.gyazo.com/a495afa3d74fd798240ea1b66837b4b9.gif)

## branch: step4

`useCount` には mutation 系だけ集約して、必要な状態の読み込みは各コンポーネントに集約する。  
Recoil を使う場合は custom hooks と相性が悪い可能性があるため、query と mutation に分離したほうが良いかも。  
`useCallback` と `memo` は削除しています。  
custom hooks + Recoil でのベストプラクティスを step5 として教えてもらえると嬉しいです。

![step4](https://i.gyazo.com/6c7f71a9e195ba94dacfaf752b3119ac.gif)

## Getting Started

### パッケージのインストール

Git から Clone 後に必要なパッケージのインストールを行います。

```bash
npm install
```

### サーバーの立ち上げ

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) にブラウザでアクセスすれば OK です。

### Storybook の立ち上げ

```bash
npm run sb
```

これで Storybook が [http://localhost:6006](http://localhost:6006) で立ち上がります。

### テスト

Jest でのテストは以下の通りです。

```bash
npm run test
```

## Tips

### バージョン情報

主なパッケージのバージョンは以下の通りです。

- TypeScript：4.5.5
- React：17.0.39
- Next.js：12.1.0
- Tailwind CSS：3.0.23
- React Hook Form：7.27.1
- Zod：3.12.0
- ESLint：8.9.0
- Prettier：2.5.1
- Storybook：6.4.14
- Plop：3.0.5
- Jest：27.5.1
- React Testing Library：12.1.3

### Form

Form 関連は React Hook Form をメインで利用しています。React Hook Form を利用することでコーディング量を減らすことができるだけでなく、レンダリングを効率的に行うことができます。React Hook Form 自体でバリデーションを行えますが、Zod もしくは Yup のようなバリデーション専用のライブラリと連携させることもでき Zod を利用します。

### デプロイ

現状では Vercel と接続すると良いでしょう。アップロード先の GitHub リポジトリを選択すれば問題なくデプロイできるはずです。

### CI/CD

GitHub Actions での CI/CD が標準で設定されています。`main` ブランチに Pull Request or Push した場合に Jest でのテストが動作します。詳細な設定は`.github/workflows.test.yml` を確認してください。

### ESLint/Prettier

[Next.js が推奨する方法](https://nextjs.org/docs/basic-features/eslint)を基本として設定しています。VSCode で保存時に Prettier が適用されるようにもなっているので便利です。ESLint の設定は `.eslintrc` に、Prettier の設定は `package.json` に記載されています。

### コンポーネントの雛形

[PLOP](https://plopjs.com/) を使って Atomic デザインのコンポーネント開発に必要な雛形が自動的に生成できるように設定してあります。以下のコマンドで対話的にコンポーネントの雛形が作成できるため試してみましょう。

```bash
npm run generate
```

PLOP の設定は `generator` ディレクトリを確認してください。

## プロジェクト

### 命名規則

`pages` など Next.js で決められているものを除き、英語は**単数形**を使います。複数形で書くことも海外では多いのですが、日本人だけのチームの時は単数形と複数形で迷う場合が多く、この思考のストレスを少しでも減らすために単数形にしています。今のところは大きな問題に遭遇したことがありません。

### コンポーネントの単位

Atomic デザインを基本としてコンポーネントを設計していきます。

- Atom (Presentational Component)
  - コンポーネントの実装は行わず Tailwind CSS の `@apply` などで決められる範囲内が目安
- Molecule (Presentational Component)
  - 複数の Atom をまとめて使いやすくする程度
- Organism (Presentational Component)
  - SSR / CSR でデータ挿入前の最大の単位
- Template (Container Component)
  - Client Sider Rendering (CSR) でデータ挿入
- Page (Container Component)
  - SSR でデータ挿入

Presentational Component としての実装の最大は Organism として、小：中：大＝ Atom：Molecule：Organism 考えると楽かと思います。Organism に const を含んだ CSR でデータ挿入を行えば Template になり、SSR でデータ挿入を行う場合には Page で管理するイメージです。

### ディレクトリ構造

```bash
kikagaku-next-starter-kit
# ソースコード
├── src
# ファイル置き場
├── public
# Next.js
├── next.config.js
├── next-env.d.ts
# Tailwind CSS
├── tailwind.config.js
├── postcss.config.js
# Jest
├── jest.config.js
├── jest.setup.js
# PLOP
├── generator
# プロジェクトの設定
├── README.md
├── node_modules
├── package.json
├── package-lock.json
└── tsconfig.json
```

ソースコード `src` のディレクトリ構造は以下の通りです。

```bash
./src
├── component
│   ├── atom
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        └── [ComponentName].stories.tsx  # Storybook
│   ├── molecule
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        ├── [ComponentName].type.ts      # Prop Types
│   │        ├── [ComponentName].props.ts     # props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test
│   │        └── [ComponentName].stories.tsx  # Storybook
│   ├── organism
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        ├── [ComponentName].type.ts      # Prop Types
│   │        ├── [ComponentName].props.ts     # props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test
│   │        └── [ComponentName].stories.tsx  # Storybook
│   └── template
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # Container Component
│   │        ├── [ComponentName].tsx          # Presentational Component
│   │        ├── [ComponentName].type.ts      # Presentational Component's Prop Types
│   │        ├── [ComponentName].props.ts     # Presentational props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test for Presentational Component
│   │        └── [ComponentName].stories.tsx  # Storybook
├── pages
│   ├── _app.tsx
│   └── index.tsx
└── style
    └── globals.css  # Tailwind CSS の設定（Atom で使う）
```
