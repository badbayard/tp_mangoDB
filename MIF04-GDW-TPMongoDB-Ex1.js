/*** EXO 1 : Q1 **************************************************************/



/*** EXO 1 : Q2 **************************************************************/

var exo1q2map = function () {
    emit(0, 1) ;

}

var exo1q2red = function (key, values) {
    var tot = 0 ;
    for (var i = 0 , n = values.length; i<n ; i++ )
    {
        tot = tot + values[i] ;
    }
    return tot ;
}

// db.zips.mapReduce(exo1q2map, exo1q2red, {out : {inline:1}});
// HINT
//		{
//			"_id" : 0,
//			"value" : 29353
//		}

/*** EXO 1 : Q3 **************************************************************/

var exo1q3map = function () {
    if(this.city === "SPRINGFIELD" )
    {
        emit(0, 1);
    }
}

var exo1q3red = exo1q2red;

// HINT
//		{
//			"_id" : 0,
//			"value" : 41
//		}


/*** EXO 1 : Q4 **************************************************************/

var exo1q4map = function () {
    emit(this.state, 1) ;
}

var exo1q4red = exo1q2red;

// HINT : 51 états comme ci dessous
// [
//		{
//			"_id" : "AK",
//			"value" : 195
//		},
//		{
//			"_id" : "AL",
//			"value" : 567
//		},
//		{
//			"_id" : "AR",
//			"value" : 578
//		},
//...

/*** EXO 1 : Q5 **************************************************************/


var exo1q5map = function () {
    var reg = new RegExp('.*SPRING.*')

    if (this.city.match(reg))
    {
        emit(0, 1);
    }
}

var exo1q5red = exo1q2red;

// HINT
//		{
//			"_id" : 0,
//			"value" : 362
//		}


/*** EXO 1 : Q6 **************************************************************/

var exo1q6map = function () {

    if (this.pop > 100000)
    {
        emit(this._id, this.pop);
    }
}

var exo1q6red = function (key, values) {
    /* TODO ?*/
	return  0;

}
//HINT 4 zips dont le suivant
/*
{
  "_id" : "60623",
  "value" : 112047
}
*/

