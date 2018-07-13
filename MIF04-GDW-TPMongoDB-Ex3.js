/*** EXO 3: Q1 ***************************************************************/
// donner la population totale de chaque ville avec l'aggregation pipeline

var exo3q1stages = [
{$sort : {state : 1 , city : 1}},
{
	$project: 
	{
		_id:{ city : "$city" , state : "$state"},
		pop :1 
	}
}];
/* Remarques et Interrogations
{
	$group: {
		_id: {city : "$city" , state : "$state"} ,
		pop : {$sum : "$pop"}
		}
}
Donne quelque chose de proche de l'indice en faisant la somme de la population pour en regroupant sur le nom de la ville + le nom de l'état. 
Mais dans ce cas, on ignore totalement le fait qu'il y a des villes homonymes au sein d'un même état. 
*/

//db.zips.aggregate(exo3q1stages)
// HINT : après exécution, on aura un curseur mongo DB qui affichera :
//{ "_id" : { "city" : "POINT BAKER", "state" : "AK" }, "pop" : 426 }
//{ "_id" : { "city" : "KLAWOCK", "state" : "AK" }, "pop" : 851 }
//{ "_id" : { "city" : "HYDABURG", "state" : "AK" }, "pop" : 891 }
//{ "_id" : { "city" : "CRAIG", "state" : "AK" }, "pop" : 1398 }
// ...

/*** EXO 3: Q2 ***************************************************************/
/* Pour cette question, nous avons choisi de prendre la fonction pipeline ci-dessus (pas celle suggérée en commentaire) et les fonction MAP/REDUCE indiquées plus bas. */
/* ********** Les fonctions MAP/REDUCE utilisée pour cette analyse **********
var exo3q1map = function () {
  emit(this._id, {city : [this.city], state : [this.state], pop : [this.pop]} );
}

var exo3q1red = function (key, values) {
	
	var city = [];
	var state = [];
	var pop = [];

	for(var i=0 , n=values.length ; i<n; i++)
	{
		city = city.concat(values[i].city);
		state = state.concat(values[i].state);
		pop = pop.concat(values[i].pop);
	}
	return {cities : city, state : state, pop : pop};
}
*/
/* ********** Performance de l'agrégation pipeline **********

Ligne exécutée pour les tests :
var tabTemps=[]; var moyenne=0; for(var i=0; i<100; i++){var tIni = Date.now();db.zips.aggregate(exo3q1stages); tabTemps[i]=(Date.now() - tIni); print(tabTemps[i]); moyenne+=tabTemps[i];}print("moyenne :" + moyenne/100);

Sur un test de 100 exécutions, on obtient les données suivantes :
89 85 87 90 109 84 87 86 86 86 .....
Temps d'exécuton moyen : 89.62 ms */


/* ********** Performance de map reduce **********

Ligne exécutée pour les tests (après avoir décommenté les fonctions exo3q1map exo3q1red ) :
var tabTemps=[]; var moyenne=0; for(var i=0; i<10; i++){var tIni = Date.now(); db.zips.mapReduce(exo3q1map, exo3q1red, {out : {inline:1}}); tabTemps[i]=(Date.now() - tIni); print(tabTemps[i]); moyenne+=tabTemps[i];}print("moyenne :" + moyenne/10);

Sur un test de 10 exécutions, on obtient les données suivantes :
6094 6288 6372 6357 6280 6346 6425 6316 6258 6436
Temps d'exécuton moyen : 6317.2 ms

On constate que, pour une requête similaire renvoyant chaque ville et sa population, le map reduce est environ 100 fois plus long que pour agregate.

Pour les requêtes n'effectuant aucun tri ni traitement sur les données, le map reduce n'est donc pas la méthode la plus adaptée. 

*/
/*** EXO 3: Q3 ***************************************************************/
// Donner pour chaque \emph{etat} le zip et la population du code postal plus peuplé.

var exo3q3stages = [
	{$sort : { pop : -1 }},
	{$group : {
		_id : "$state" ,
		zip : {$first : "$_id"},
		pop : {$first : "$pop"}
	}},
	{ $project: { _id : "$_id", max : {zip : "$zip", pop: "$pop" } } }
];
/*
Par contre l'affichage n'est pas  exactement celui attendu (ou présenté en commentaire plus bas). 

Avec un max (mais sans le zip) :
{
	$group: {
		_id: "$state" ,
		max :	{
			 $max : "$pop" 
			}
		}
}
*/
// HINT : après exécution, on aura un curseur mongo DB qui affichera :
//{ "_id" : "AK", "max" : { "zip" : "99504", "pop" : 32383 } }
//{ "_id" : "AZ", "max" : { "zip" : "85364", "pop" : 57131 } }
//{ "_id" : "UT", "max" : { "zip" : "84118", "pop" : 55999 } }
//{ "_id" : "WY", "max" : { "zip" : "82001", "pop" : 33107 } }
//{ "_id" : "CO", "max" : { "zip" : "80123", "pop" : 59418 } }
//{ "_id" : "ID", "max" : { "zip" : "83704", "pop" : 40912 } }
//{ "_id" : "OK", "max" : { "zip" : "73505", "pop" : 45542 } }
//{ "_id" : "AR", "max" : { "zip" : "72401", "pop" : 53532 } }
//{ "_id" : "LA", "max" : { "zip" : "70072", "pop" : 58905 } }
//{ "_id" : "NV", "max" : { "zip" : "89115", "pop" : 51532 } }
//{ "_id" : "NE", "max" : { "zip" : "68104", "pop" : 35325 } }
//{ "_id" : "KS", "max" : { "zip" : "66502", "pop" : 50178 } }
//{ "_id" : "MO", "max" : { "zip" : "63136", "pop" : 54994 } }



