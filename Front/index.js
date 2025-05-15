document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os botões com classe .cta-button ou .signup-button
  const botoes = document.querySelectorAll('.cta-button, .signup-button');

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      fetch('http://localhost:3000/cta-button', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cursoId: 1 }), // Altere conforme necessário
      })
        .then(res => res.json())
        .then(data => {
          alert('Inscrição realizada com sucesso!');
        })
        .catch(err => {
          alert('Erro ao realizar inscrição.');
        });
    });
  });
});
