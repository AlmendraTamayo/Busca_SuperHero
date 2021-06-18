$(document).ready(() => {
    $('button').click(() =>{
      const ValorDelInput = $('input').val();
      if (ValidarNumeroIngresado(ValorDelInput)==false) {
        alert('Recuerda, ingresa sólo números entre el 1 y el 731')
      } else {
        ObtieneAlHeroe(ValorDelInput);
      };
    });
  

    const ValidarNumeroIngresado = (ValorIngresado) => {
        const IngresoPermitido = /[^0-9]/g;
        if (IngresoPermitido.test(ValorIngresado) || ValorIngresado > 731 || ValorIngresado<1) {
          return false
        } else {
          return true
        }
      }




    const ObtieneAlHeroe = (NumeroDelHeroe) => {
      $.ajax({
          type: 'GET',
          url: "https://us-central1-crud-vue-firebase-3af18.cloudfunctions.net/instrument/superhero/10222760568656845/" + NumeroDelHeroe,
          success: (InfoHeroe) => {
            const NombreDelHeroe = InfoHeroe.name;
            const tarjetaDelHeroe = [];
            tarjetaDelHeroe.push(`
            <div class="row no-gutters">
            <div class="col-md-4">
              <img id="ImagenDelHeroe" src="${InfoHeroe.image.url}" alt="..." class=" w-100">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5" class="card-title">Nombre:  ${NombreDelHeroe}</h5>
                <p id="Conexiones" class="card-text">Conexiones:  ${InfoHeroe.connections['group-affiliation']}</p>
                <p id="PublicadoPor" class="card-text text-right"><small class="text-muted "><i>Publicado por:</i>  ${InfoHeroe.biography.publisher}</small></p>
                <p id="Ocupacion" class="card-text"><i>Ocupación:</i>  ${InfoHeroe.work.occupation}</p>
                <p id="PrimeraAparicion" class="card-text"><i>Primera Aparición:</i>  ${InfoHeroe.biography['first-appearance']}</p>
                <p id="Altura" class="card-text"><i>Altura:</i>  ${InfoHeroe.appearance.height}</p>
                <p id="Peso" class="card-text"><i>Peso:</i>  ${InfoHeroe.appearance.weight}</p>
                <p id="Alianzas" class="card-text"><i>Alianzas:</i>  ${InfoHeroe.biography.aliases}</p>
              </div>
            </div>
          </div>
            `)
            const PowerStats = InfoHeroe.powerstats;
            const datePoints = [];
            for (keys in PowerStats) {
              datePoints.push({ y: parseInt(PowerStats[keys]) || 0, label: keys })
            }
            renderChart(datePoints, NombreDelHeroe);
            $("#chartContainer").removeClass("d-none");
            $('#TarjetaHeroe').html("");
            $('#TarjetaHeroe').append(tarjetaDelHeroe);
            $("#TarjetaHeroe").removeClass("d-none");
          },
          dataType: 'json',
          error: (data) => {
            console.log(data)
            alert('Error con la petición');
          },
        }) 
    }; 
  })
  

  const renderChart = (datePoints, NombreDelHeroe) => {
    const chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: `Estadísticas de poder para ${NombreDelHeroe}`
      },
      subtitles: [{
        text: `${NombreDelHeroe}`
      }],
      animationEnabled: true,
      data: [{
        type: "pie",
        startAngle: 40,
        toolTipContent: "<b>{label}</b>: ({y})",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 20,
        indexLabel: "{label} - ({y})",
        dataPoints: datePoints
      }]
    });
    chart.render();
  };