interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
  clientId?: string;
}

interface Pessoa {
  nome: string;
  cpf: string;
}

interface Cliente extends Pessoa {
  veiculos: Veiculo[];
}

(function () {
  const $ = (query: string): HTMLInputElement | null => 
  document.querySelector<HTMLInputElement>(query);

  function calcTempo(millisseconds: number) {
    const minutes = Math.floor(millisseconds/60000);
    const seconds = Math.floor((millisseconds % 60000) / 1000);

    return `${minutes}m e ${seconds}s`;
  }
  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
        <button class="delete" data-placa="${veiculo.placa}">X</button>
      </td>
      `;

      row.querySelector(".delete")?.addEventListener("click", function(){
        remover(this.dataset.placa);
      });
      
      $("#patio")?.appendChild(row);

      if(salva) {
        salvar([...ler(), veiculo]);
      }

    }

    function remover(placa: string) {
      const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

      const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

      if(!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

      salvar(ler().filter(veiculo => veiculo.placa !== placa));
      render();
    }

    function render() {
      $("#patio")!.innerHTML = "";
      const patio = ler();

      if(patio.length) {
        patio.forEach(veiculo => adicionar(veiculo));
      }
    }

    return { ler, adicionar, remover, salvar, render };
  }

  patio().render();

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;

    if (!nome || !placa) {
      alert("Os campos nome e placa s??o obrigat??rios");
      return;
    }
    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
  
})();
