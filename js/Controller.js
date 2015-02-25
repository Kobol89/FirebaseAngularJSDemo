/** Created by abastian on 25.02.15. */

const debug = false;



// Firebase
var Firebase = new Firebase("https://userstorage.firebaseio.com/");

// AngularJS: Neue Application
var UserApp = angular.module('UserApp',['ngRoute','firebase']);

/**
 * Controller für Nutzerverwaltung
 */
UserApp.controller('UserController', ['$scope', '$firebase', function($scope, $firebase){

    // AngularFire Synchronisation
    var FBSync = $firebase(Firebase);

    // Initialisierung
    $scope.users = FBSync.$asArray();


    /**
     * Nutzer hinzufügen
     */
    $scope.addUser = function(){
        //alert("Add User");
        document.getElementById("dialog_user").style.display = "block";
    } // $scope.addUser = function(){

    /**
     * Nutzeränderungen
     * @param UserID
     */
    $scope.changeUser = function(UserID){

        // Dialog anzeigen
        document.getElementById("dialog_user").style.display = "block";

        // Finde Nutzer anhand seiner ID
        Firebase.orderByChild("id")
            .startAt(UserID)
            .endAt(UserID)
            .on("value", function(UserSnapshot) {

                if(debug)
                    console.log(UserSnapshot.val());

                var user = null;

                for (var id in UserSnapshot.val()){
                    user = UserSnapshot.val()[id];
                }

                $scope.userdetail      = user;
        });

    } // $scope.changeUser = function(UserID){


    /**
     * Gelöscht - wird nun direkt durchgeführt
     * Nutzer löschen
     * @param UserID
     */
/*   $scope.deleteUser = function(UserID){
        //alert("Delete User " + UserID);
        // TODO Abfrage ob wirklich gelöscht werden soll.

        var UserRef = Firebase.child("id")
            .startAt(UserID)
            .endAt(UserID);

        console.log(UserRef);

        // zumTest
        //FBSync.$remove("-Jj0NWjj_doCU7hcdunu");


    } // $scope.deleteUser = function(UserID){
*/
    /**
     * Nutzer speichern
     */
    $scope.saveUser = function() {
        //alert("Save User");

        if(debug)
            console.log(
                " $scope.userdetail.id= " +   $scope.userdetail.id +
                " $scope.userdetail.name= " +   $scope.userdetail.name +
                " $scope.userdetail.lastname= " + $scope.userdetail.lastname +
                " $scope.userdetail.address= " + $scope.userdetail.address
            );

        // Daten nur dann Speichern, wenn auch im jeden Feld etwas enthalten ist.
        if ($scope.userdetail.name.length > 0
        && $scope.userdetail.lastname.length > 0
        && $scope.userdetail.address.length > 0 ) {
            // Neuer Nutzer
            if ($scope.userdetail.id == undefined) {
                var newID = 0;
                Firebase
                    .orderByChild("id")
                    .on("value", function(values){
                        newID = Object.keys(values.val()).length;

                    // console.log("newID=" + newID);
                });


                // Speichere die Daten
                Firebase.push({
                    id: newID,
                    name:      $scope.userdetail.name,
                    lastname:  $scope.userdetail.lastname,
                    address:   $scope.userdetail.address
                 });

            } else { // if($scope.userdetail.id == undefined)

                var UserRef = Firebase.child("id")
                    .startAt($scope.userdetail.id)
                    .endAt($scope.userdetail.id);

                UserRef.$update({
                    name:       $scope.userdetail.name,
                    lastname:   $scope.userdetail.lastname,
                    address:    $scope.userdetail.address
                });
    /*            console.log(UserRef);
                UserRef.set({
                    name:       $scope.userdetail.name,
                    lastname:   $scope.userdetail.lastname,
                    address:    $scope.userdetail.address
                });*/
            } // else
        } else {
            alert("Bitte in jedes Feld Daten eintragen!");
        }

        // Objekt wegwerfen
        $scope.userdetail = null;
        document.getElementById("dialog_user").style.display = "none";

    } // $scope.saveUser = function() {

    /**
     * Nutzeränderung / -anlage abbrechen
     *  - Dialog hidden
     */
    $scope.cancelUser = function() {
        //alert('Cancel User');
        document.getElementById("dialog_user").style.display = "none";
        $scope.userdetail = null;
    } // $scope.cancelUser = function() {

    /**
     * Nutzerliste neu laden
     */
    $scope.refreshUsers = function(){
        // Lese alle Nutzer aus und zeige sie an
        /* Alt - Einfacher mit AngularFire
        Firebase.on("value", function(values){
            if(debug)
                console.log("Refresh Users=" + values.val());

            var users = values.val();

            $scope.users = users;
        });*/

        $scope.users = FBSync.$asObject();

    } // $scope.refreshUsers = function(){
}]);