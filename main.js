var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function talaj(x, magassag) {
  this.x = x;
  this.szelesseg = Math.floor(Math.random() * 300) + 400;
  this.magassag = magassag;
}

var vilag = {
  magassag: 480,
  szelesseg: 640,
  gravitacio: 10,
  megtettTav: 0,
  legmagasabbTalaj: 240,
  sebesseg: 5,
  talajCsempe: [
    new talaj(0, 140)
  ],
  megrajzolas : function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.szelesseg, this.magassag);
    for (var index in this.talajCsempe) {
      var csempe = this.talajCsempe[index];
      var y = this.magassag - csempe.magassag;
      ctx.fillStyle = "blue";
      ctx.fillRect(csempe.x, y, csempe.szelesseg, csempe.magassag);
    }
  },
  talajMozgatas: function() {
    for (var index in this.talajCsempe) {
      var csempe = this.talajCsempe[index];
      csempe.x -= this.sebesseg;
      this.megtettTav += this.sebesseg;
    }
  },
  ujCsempeHozzaadas: function() {
    if(this.talajCsempe.lenght >= 3){
      return;
    }
    var elozoCsempe = this.talajCsempe[this.talajCsempe.length-1];
    var randomMagassag = Math.floor(Math.random() * this.legmagasabbTalaj) + 20;
    var balEretek = elozoCsempe.x + elozoCsempe.szelesseg;
    var kovetkezo = new talaj(balEretek, randomMagassag);
    this.talajCsempe.push(kovetkezo)
  },
  regiCsempeTorlese: function () {
    for(var index in this.talajCsempe) {
      if (this.talajCsempe[index].x <= -this.talajCsempe[index].szelesseg) {
        this.talajCsempe.splice(index, 1);
      }
    }
  },
  tick: function() {
    this.regiCsempeTorlese();
    this.ujCsempeHozzaadas();
    this.talajMozgatas();
  },
};

var jatekos = {
  x: 160,
  y: 340,
  magassag: 20,
  szelesseg: 20,
  megrajzolas: function(){
    ctx.fillStyle = "green";
    ctx.fillRect(jatekos.x, jatekos.y - jatekos.magassag,
      this.magassag, this.szelesseg);
  }
} 

function tick() {
  vilag.tick();
  vilag.megrajzolas();
  jatekos.megrajzolas(); 
  window.setTimeout(()=>tick(), 1000/60);
}
tick();