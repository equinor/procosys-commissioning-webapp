const globalStyles = `

  html,
  body {
    font-family: 'Lato', sans-serif;
    font-size: 18px;
    color: black;
    -webkit-font-smoothing: antialiased;
    @media print {
      font-size: 10pt;
    }
  }

  body {
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  button,
  input,
  label {
    font-family: inherit;
  }
`;

export default globalStyles;
