'use strict'

var doc = new jsPDF('p', 'pt', 'letter');
// new jsPDF()

function materia_reporte() {
    // var materias = document.querySelector(".MateriasPDF")
    var materias = $(".MateriasPDF")[0]

    // doc.addHTML($('.MateriasPDF')[0], function () {
    //     doc.save('Test.pdf');
    // })

    doc.fromHTML(materias, 15, 10, { 'width': 170 })
    doc.output("dataurlnewwindow");

    // window.open ("","_blank","toolbar=yes, scrollbars=yes, resizable=yes, top=50, left=60, width=1200, height=600")
}
