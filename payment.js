var express = require('express');
var pool = require('./pool');

var router = express.Router();

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/payment_interface', function(req, res, next) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN) 
            res.render('paymentForm', { message: "", color: "black"});
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }
 
});

router.post("/insert_record", function( req, res) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN==null) 
            res.redirect('/admin/admin_login')
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }

    try {
        pool.query(
            "insert into user (user_name, email, contact, password, gender, dob) values (?,?,?,?,?,?)",
            [
                req.body.user_name,
                req.body.email,
                req.body.contact,
                req.body.password,
                req.body.gender,
                req.body.dob,
            ],
            function (error, result) {
                if(error) {
                    // console.log(error);

                    res.render("paymentForm", { status: false, message: error, color: "red",
                    })
                }
                else {
                    // console.log(result)
                    res.render("paymentForm", {status: true, message: "Successfully", color: "green"
                        
                    });
                }
            }
        );
    }
    catch (e) {
        // console.log(e);
        res.render("paymentForm", { status: false, message: "error in backend....", color: "red",
        });
    }
});

/*
router.post("/initial_balance" , function (req, res) {
    //  const userId = req.body.toUserid;
    // const amount = req.body.amount;

  try {
    pool.query(
      "insert into balance (userid, balance_amt) values (?,?)",
      [
        req.body.toUserid,
        req.body.amount,
      ],

      function (error, result) {
        if (error) {
          console.log("hi",error);

          res.render("initialbalance", {
            status: false,
            message: error,
            color: "red",
          });
        } else {
          console.log(result);
          // console.log(req.file.filename);
          res.render("initialbalance", {
            status: true,
            message: "Information Submitted Successfully",
            color: "green",
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res.render("initialbalance", {
      status: false,
      message: "Some Critical error, contact to Backend team....",
      color: "red",
    });
  }
});
*/

router.get("/insert_money", function(req, res) {
    
    // Your logic here
    res.render("initialbalance", { message: "", color: "black"}); // or res.send(...)
});


router.post("/insert_money", function( req, res) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN==null) 
            res.redirect('/admin/admin_login')
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }

    try {
        pool.query(
            "insert into balance (userid, balance_amt) values (?,?)",
            [
                req.body.toUserid,
                req.body.amount,
            ],
            function (error, result) {
                if(error) {
                    console.log(error);

                    res.render("initialbalance", { status: false, message: error, color: "red",
                    })
                }
                else {
                    console.log(result)
                    res.render("initialbalance", {status: true, message: "Successfully", color: "green"
                        
                    });
                }
            }
        );
    }
    catch (e) {
        console.log(e);
        res.render("initialbalance", { status: false, message: "error in backend....", color: "red",
        });
    }
});



router.get('/payment_face', function(req, res, next) {
     try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN) 
            res.render('balanceForm', { message: "", color: "black"});
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }

 
});

router.post("/balance_record", function( req, res) {
    // console.log(req.body.amount)
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN==null) 
            res.redirect('/admin/admin_login')
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }

    try {
        if(req.body.btn == 'debit') {
        pool.query(
            "select balance_amt from balance where userid = ?;", [ req.body.toUserid ],
            function (error, result) {
                if(error) {
                    // console.log(error);

                    res.render("balanceForm", { status: false, message: error, color: "red",
                    })
                }
                
                else {
                   
                    let toAdd = parseInt(req.body.amount) + result[0].balance_amt
                    // toAdd = 500
                    // console.log(toAdd);
                   pool.query("update balance set balance_amt=? where userid = ?;", [ toAdd , req.body.toUserid ], 
                    function (error, result) {
                        if(error) {
                            // console.log(error);

                            res.render("balanceForm", {status: false, message: error, color: "red",

                            })
                        }
                        else {
                            // console.log(result);
                            // console.log(typeof(result));

                            res.render("balanceForm", {status: true, message: "Successfully", color: "green",})

                        }
                    });            
                }
            });
        }
                else {
                
                   pool.query(
                    "select balance_amt from balance where userid = ?;", [ req.body.toUserid ],
                    function (error, result) {
                    if(error) {
                    // console.log(error);

                    res.render("balanceForm", { status: false, message: error, color: "red",
                    })
                }
                
                else {
                //    console.log("hi hi", result);
                //    console.log("hey", parseInt(req.body.amount))

                    let tomin = result[0].balance_amt - parseInt(req.body.amount)
                    
                    // tomin = 500
                    console.log("result is: ",tomin);
                   pool.query("update balance set balance_amt=? where userid = ?;", [ tomin , req.body.toUserid ], 
                    function (error, result) {
                        if(error) {
                            console.log(error);

                            res.render("balanceForm", {status: false, message: error, color: "red",

                            })
                        }
                        else {
                            console.log(result);
                            console.log(typeof(result));

                            res.render("balanceForm", {status: true, message: "Successfully", color: "green",})

                        }
                    });            
                }
            });
            }  

         }

    catch (e) {
        console.log(e);
        
        res.render("balanceForm", { status: false, message: "error in backend....", color: "red",
        });
    }
});

router.get("/Search_customer", function (req, res, next) {
    res.render("searchcustomer", {message: "", color:"black"});
})

router.get("/display_all", function( req, res) {
    try{
        var ADMIN=localStorage.getItem('ADMIN')
        if(ADMIN==null) 
            res.redirect('/admin/admin_login')
    }
    catch(e) {
        res.redirect('/admin/admin_login')
    }
try{
    pool.query(
        "SELECT P.*, U.user_name FROM balance P LEFT JOIN user U ON U.userid = P.userid;",
            function( error, result) {
            // console.log(error)
            if(error) {
            res.render("displayall", {
                status: false,
                message: "Error in database query....",
               
            });
        }
        else {
            // console.log(result)
            res.render("displayall", {status: true, data: result});
        } 
        }
    );
}
    catch (e) {
        // console.log(e)
        res.render("displayall", {status: false, message: "Critical error in database server...."});
    }
});




//  select P.*,(select U.user_name from user U where U.userid=P.userid) as user_name,(select B.balance_amt from balance B where B.userid=P.userid) as balance_amt from balance P 

module.exports = router;
