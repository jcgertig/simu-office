// TODO(dlk): extract this info from webpack’s stats file
function resources() {
  if (process.env.NODE_ENV === 'development') {
    return '<script async src="//localhost:4001/dist/main.js"></script>';
  }

  return `
    <link rel="stylesheet" href="/cdn/styles.css" />
    <script async src="/cdn/main.js"></script>
  `.trim();
}

export var resources = resources;
