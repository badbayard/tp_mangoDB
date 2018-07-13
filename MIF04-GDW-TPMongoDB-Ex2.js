/*** EXO 2 : Q1 **************************************************************/
// Donner la population totale de chaque etat.

var exo2q1map = function () {
  emit(this.state, this.pop);
}

var exo2q1red = function (key, values) {
   var tot = 0 ;
    for (var i = 0 , n = values.length; i<n ; i++ )
    {
        tot = tot + values[i] ;
    }
    return tot ;
}

// VERIFICATION http://en.wikipedia.org/wiki/2010_United_States_Census
// HINT
//[
//	{
//		"_id" : "CA",
//		"value" : 29754890
//	},
//	{
//		"_id" : "NY",
//		"value" : 17990402
//	},
//	{
//		"_id" : "TX",
//		"value" : 16984601
//	}
//  ...
//]


/*** EXO 2: Q2 ***************************************************************/
//Donner la liste des villes des US

var exo2q2map = function () {
  var key = {
      city : this.city ,
      state : this.state
  };
  emit(key ,0)

}

var exo2q2red = function (key, values) {
  return 0;
}

//db.zips.mapReduce(exo2q2map, exo2q2red, {out : {inline:1}, limit:4});

// HINT : 25701 réponses. La clef doit être UNE PAIRE
//"results" : [
//      {
//			"_id" : {
//				"city" : "ZUNI",
//				"state" : "VA"
//			},
//			"value" : 0
//		}
//    ...
//	]


/*** EXO 2: Q3 ***************************************************************/
// Pour chaque état, donne la liste de ses villes (sans supprimer les villes homonymes)
var exo2q3map = function () {
  
  emit(this.state, {cities : [this.city]} );
}

var exo2q3red = function (key, values) {
  
  var cities= [];
  for(var i=0 , n=values.length ; i<n; i++)
  {
     cities = cities.concat(values[i].cities)
  }
  return {cities : cities};

}

// HINT :  51 resultats avec la structure suivante
//  {
//			"_id" : "WY",
//			"value" : {
//				"cities" : [
//					"AFTON",
//					"THAYNE",
//          ...
//					"CHEYENNE"
//				]
//			}


/*** EXO 2: Q4 ***************************************************************/
//
var exo2q4map = function () {
    var val = new Object() ;
    val[this.city] = 0 ;
    emit(this.state , val );
};

var exo2q4red = function (key, values) {
    var cities = values[0];
    for(var i=1 , n=values.length ; i<n; i++) // Selection d'un objet
    {
	for (var c in values[i]) //On parcourt les propriétés de l'objet
	{
        cities[c] = 0 ; // Que l'on ajoute à cities.
	}
    }


    return cities;

}

/* Autre version :
var exo2q4map = function () {
    emit(this.state, {cities : [this.city]} );
};

var exo2q4red = function (key, values) {
    var cities= [];
    for(var i=0 , n=values.length ; i<n; i++)
    {
        cities = cities.concat(values[i].cities)
    }

    // On nettoie le tableau !
    // Création d'un tableau associatif intermédiaire
    var asso = [] ;
    for (var i = 0; i < cities.length ; i++) {
        asso[cities[i]] = 1 ;
    }
    // On recrée un tableau tout propre !
    var nCities  = [];
    for (var obj in asso)
    {
        nCities.push(obj);
    }

    // Que l'on donne en sortie
    return {cities : nCities};

}
*/

// HINT 51 objets résultats a la structure suivante
//{
//			"_id" : "WY",
//			"value" : {
//				"CHEYENNE" : 0,
//				"ALBIN" : 0,
//				"LARAMIE" : 0,
//				"BUFORD" : 0,
//				"BURNS" : 0,
//				"CARPENTER" : 0,
//				"CENTENNIAL" : 0,
//...
//}

/*** EXO 2: Q5 ***************************************************************/

var exo2q5map = function () {
/* préparation de l'objet à donner en value */
res =         {
            min:
                {
                    pop: this.pop,
                    id: this._id
                },
            max:
                {
                    pop: this.pop,
                    id: this._id
                }
        };

    emit(this.state,res);
}



var exo2q5red = function (key, values) {
  var mini = {
      pop : values[0].min.pop,
      id : values[0].min.id
  };
  var maxi =
      {
      pop : values[0].max.pop,
      id : values[0].max.id
  };

  for (var i = 1, n =  values.length ; i <n ; i++)
  {
      // minimum
      if(mini.pop > values[i].min.pop)
      {
          mini.id = values[i].min.id ;
          mini.pop = values[i].min.pop ;
      }
      // maximum
      if(maxi.pop < values[i].max.pop)
      {
          maxi.id = values[i].max.id ;
          maxi.pop = values[i].max.pop ;
      }
  }
return {min : mini, max: maxi};


}

// ATTENDU :51 resultats avec la structure suivante
//{
//		"_id" : "WY",
//		"value" : {
//			"min" : {
//				"pop" : 6,
//				"id" : "82224"
//			},
//			"max" : {
//				"pop" : 33107,
//				"id" : "82001"
//			}
//		}
//	}


/*** EXO 5: Q6 ***************************************************************/
//Donner la population moyenne des codes postaux de chaque etat.

var exo2q6map = function () {
  emit (this.state, {
	w : 1,
	p : this.pop
  });
}

var exo2q6red = function (key, values) {
  var lp = 0 ;
  var lw = 0 ;
  for (var i = 0, n =  values.length ; i <n ; i++)
  {
	lp += values[i].p ;
  	lw += values[i].w ;
  }
  return { w : lw , p : lp } ;

}

var exo2q6fin = function (key, val) {
  val.avg = val.p / val.w ;
  return val ;
};

// db.zips.mapReduce(exo2q6map, exo2q6red, {out : {inline : 1}, finalize : exo2q6fin});
// HINT
//  {
//    "_id" : "WY",
//    "value" : { 
//      "w" : 140,
//      "p" : 453528,
//      "avg" : 3239.4857142857145
//      }
//  }


/*** EXO 2: Q7 ***************************************************************/

var exo2q7map = function () {
   emit("most_crowded", {state : this.state, pop : this.pop});
}

var exo2q7red = function (key, values) {
  var etats = [];
  var pops = []; // pops[i] correspondera à la population de etats[i]
  var index;
  for(var i = 0, n = values.length ; i < n ; i++)
  {
    index = etats.indexOf(values[i].state);
    if (index == -1) // Etat pas encore rencontré
    {
      etats = etats.concat(values[i].state);
      pops = pops.concat(values[i].pop);
    }
    else // Etat déjà rencontré : on somme la population
    {
      pops[index] = pops[index] + values[i].pop;
    }
  }

  return {state : etats, pop : pops};
}

var exo2q7fin = function (key, values) {
 var rangMax = 0;
  for(var i = 1, n = values.pop.length ; i < n ; i++)
  {
    if(values.pop[i] > values.pop[rangMax])
    {
      rangMax = i;
    }
  }

  return {state : values.state[rangMax], pop : values.pop[rangMax]};
};

// HINT
//	"results" : [
//		{
//			"_id" : "most_crowded",
//			"value" : {
//				"state" : "CA",
//				"pop" : 29754890
//			}
//		}
//	],

/*** EXO 2: Q8 ***************************************************************/
exo2q8map = function () {
emit("5stats", 
{
	nb : 1,
	sum : this.pop,
	max : this.pop,
	avg : 0, /* Juste pour que l'affichage corresponde */
	std: this.pop * this.pop /* On fait le carré ici */
});

}


exo2q8red = function (key, values) {
  var lsum = 0 ; // Somme des valeurs
  var lnb = 0 ; // Nombre de valeurs
  var lstd = 0; // contiendra la somme des carrés
  var maxi = 0 ; // Maximum pop
  for (var i = 0, n =  values.length ; i <n ; i++)
  {
	lsum += values[i].sum ;
  	lnb += values[i].nb ;
	lstd += values[i].std ;
	//lstd += values[i].sum * values[i].sum;
	if (maxi <  values[i].max)
	{
		maxi = values[i].max ;
	}
  }

  return { nb : lnb ,
	   sum : lsum ,
	   max : maxi ,
	   avg : 0,
	   std : lstd
	 } ;

/* Autre solution, on écarte la valeur d'index 0, on effectue les calculs puis on le considère à la fin de cette manière :

	if (values[0].max > maxi)
	maxi = values[0].max ;

  return { nb : values[0].nb+lnb ,
	   sum : values[0].sum +lsum ,
	   max : maxi ,
	   std : values[0].std + lstd
	 } ;
*/
}

exo2q8fin = function (key, val) {
  val.avg = val.sum / val.nb ; /* Calcul de la moyenne */
  val.std = Math.sqrt( (val.std - (val.nb * val.avg * val.avg) ) / (val.nb -1) ); /* Et de l'écart-type */
  return val;
};


//HINT : le patibulaire objet résultat est celui-ci
//		{
//			"_id" : "5stats",
//			"value" : {
//				"nb" : 29353,
//				"sum" : 248408400,
//				"max" : 112047,
//				"avg" : 8462.794262937348,
//				"std" : 12329.6803058536
//			}
//		}

