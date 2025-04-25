var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

window.addEventListener("keypress", function (keyInfo) {
  jatekos.billentyunyomas(keyInfo)
}, false)

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
  autoScroll: true,
  legmagasabbTalaj: 200,
  sebesseg: 5,
  talajCsempe: [
    new talaj(0, 140)
  ],
  stop: function() {
    this.autoScroll = false;
  },
  megrajzolas: function() {
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
  talajTavMegadas: function (jatekosX) {
    for (var index in this.talajCsempe) {
      var csempe = this.talajCsempe[index];
      if (csempe.x <= jatekosX && jatekosX <= csempe.x + csempe.szelesseg) {
        return csempe.magassag;
      }
    }
    return -1
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
    if(!this.autoScroll) {
      return;
    }
    this.regiCsempeTorlese();
    this.ujCsempeHozzaadas();
    this.talajMozgatas();
  },
};

var jatekos = {
  x: 160,
  y: 240,
  magassag: 20,
  szelesseg: 20,
  aktualisTalajTav: 0,
  lehuzoEro: vilag.gravitacio,
  ugrasMagassag: 0,
  billentyunyomas: function(keyInfo) {
    var talajMagassag = vilag.talajTavMegadas(this.x);
    var aPadlon = talajMagassag == (vilag.magassag - this.y);
    console.log(talajMagassag, aPadlon);
    if(aPadlon) {
      this.lehuzoEro = -30;
    }
  },
  tavMegadas: function (x) {
    var lentiPlatform = vilag.talajTavMegadas(x);
    return vilag.magassag - this.y - lentiPlatform;
  },
  gravitacioAlkalmazas: function () {

    this.aktualisTalajTav = this.tavMegadas(this.x);
    if (this.aktualisTalajTav >= 0) {
      var eses = Math.min(this.aktualisTalajTav, this.lehuzoEro)
      this.y += eses;
    } 
    // BUG: itt valami bug van! Ha a játékos jobb éle és a bal éle közé esik a platform bal éle, akkor a játékos meghal
    if(this.lehuzoEro < 0) {
      this.ugrasMagassag += (this.lehuzoEro * -1);
      if (this.ugrasMagassag >= this.magassag * 6) {
        this.lehuzoEro = vilag.gravitacio;
        this.ugrasMagassag = 0;
      }
    }
  },
  megrajzolas: function(){
    ctx.fillStyle = "green";
    ctx.fillRect(jatekos.x, jatekos.y - jatekos.magassag,
      this.magassag, this.szelesseg);
  },
  tick: function() {
    this.gravitacioAlkalmazas();
  }
} 

function tick() {
  vilag.tick();
  vilag.megrajzolas();
  jatekos.tick();
  jatekos.megrajzolas(); 
  window.setTimeout(()=>tick(), 1000/60);
}
tick();