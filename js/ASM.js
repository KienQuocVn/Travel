
function darkmode() {
  var element = document.body;
  element.dataset.bsTheme = element.dataset.bsTheme == "light" ? "dark" : "light";
}
var app = angular.module("myapp", ["ngRoute"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/home", { templateUrl: "assets/Main.html" })
    .when("/TN", { templateUrl: "assets/TrongNuoc.html" })
    .when("/NN", { templateUrl: "assets/NuocNgoai.html" })
    .when("/KD", { templateUrl: "assets/KhachDoan.html" })
    .when("/contact", { templateUrl: "assets/LienHe.html" })
    .when("/thongtin", { templateUrl: "assets/DatHang.html" })
    .when("/giohang",
      {
        templateUrl: "assets/GioHang.html?" + Math.random(),
        controller: "myctrl",
      })
    .when("/search", { templateUrl: "assets/Search.html" })
    .when("/Res", 
    { 
      templateUrl: "assets/Res.html",
      controller: "myctrl" 
    })
    .when("/login", 
    { 
      templateUrl: "assets/Login.html",
      controller: "myctrl" 
    })
    .when("/change", 
    { 
      templateUrl: "assets/ChangePass.html",
      controller: "myctrl" 
    })
    .when("/Change", { templateUrl: "assets/ChangePass.html" })
    .when("/ChiTiet/:id", {
      templateUrl: "assets/ChiTiet.html?" + Math.random(),
      controller: "myctrl",
    })
    .otherwise({
      templateUrl: "assets/Main.html",
    });
});
app.run(function ($rootScope) {
  $rootScope.$on("routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("routeChangeError", function () {
    $rootScope.loading = false;
    alert("lỗi ko truy cập được template");
  });
});
app.controller("myctrl", function ($scope, $http, $rootScope, $routeParams) {
  $scope.products = [];
  $scope.sortColumn = "name"
  //tìm số lượng
  $scope.tongsoluong = function () {
    var tsl = 0;
    if ($scope.Cart && $scope.Cart.length > 0) {
      for (var i = 0; i < $scope.Cart.length; i++) {
        tsl += $rootScope.Cart[i].quantity;
      }
    }
    return tsl;
  };
  //tìm tổng giá
  $scope.total = function () {
    var total = 0;
    if ($scope.Cart && $scope.Cart.length > 0) {
      for (var i = 0; i < $rootScope.Cart.length; i++) {
        total += $rootScope.Cart[i].quantity * $rootScope.Cart[i].sale;
      }
    }
    return total;
  }
  //xóa SP
  $scope.xoa = function (index) {
    $scope.Cart.splice(index, 1);
  }
  $scope.addSP = function (product) {
    if (typeof $rootScope.Cart == "undefined") {
      $rootScope.Cart = [];
    };
    var index = $rootScope.Cart.findIndex((item) => item.id == product.id);
    if (index == -1) {
      product.quantity = 1;
      $rootScope.Cart.push(product);
    } else {
      $rootScope.Cart[index].quantity++;
    }
    Swal.fire({
      title: "Đặt thành công!",
      text: "Vui lòng vào giỏ hàng để xem chi tiết",
      icon: "success"
    });
    console.log($rootScope.Cart)
  }
  //dọc dữ liệu
  $http.get("Data.json").then(function (reponse) {
    $scope.products = reponse.data;
    //Khúc này là chuyển từ id để lấy sản phẩm 
    $scope.detailPro = $scope.products.find(item => item.id == $routeParams.id);
  });
// dang ky
$scope.list_acc = [];
$scope.info = {};
if (localStorage.getItem("list_account")) {
  $scope.list_acc = angular.fromJson(localStorage.getItem("list_account"));
}
$scope.reg = function() {
  // Kiểm tra xem các trường thông tin bắt buộc đã được điền đầy đủ hay không
  if ($scope.info.email && $scope.info.password && $scope.info.confirmPassword) {
    if ($scope.info.password === $scope.info.confirmPassword) {
      if ($scope.list_acc.push(angular.copy($scope.info))) {
        localStorage.setItem("list_account", angular.toJson($scope.list_acc));
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Vui lòng đăng nhập",
          icon: "success"
        });
      }
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Xác nhận mật khẩu không khớp",
        icon: "error"
      });
    }
  } else {
    Swal.fire({
      title: "Lỗi!",
      text: "Vui lòng điền đầy đủ thông tin",
      icon: "error"
    });
  }
};
  function checkLogin(user, pass) {
    // duyệt mảng
    for (let i = 0; i < $scope.list_acc.length; i++) {
      if ($scope.list_acc[i].email == user && $scope.list_acc[i].password == pass) {
 
        return $scope.list_acc[i]; // trả về phần tử nếu điều kiện đúng
      }
    }
  }
  
  $scope.login = function() {
    // Kiểm tra xem các trường thông tin bắt buộc đã được điền đầy đủ hay không
    if ($scope.info.email && $scope.info.password) {
      var check = checkLogin($scope.info.email, $scope.info.password);
      if (check != null) {
        sessionStorage.setItem('login', angular.toJson(check));
        $rootScope.isLogin = true;
        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success"
        });
        window.location.href = "#!home";
      } else {
        Swal.fire({
          title: "Lỗi!",
          text: "Tài khoản hoặc mật khẩu không chính xác",
          icon: "error"
        });
      }
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "error"
      });
    }
  };

  $rootScope.isLogin =false;
  if (sessionStorage.getItem('login')) {
    $rootScope.isLogin = true;
    $rootScope.info = angular.fromJson(sessionStorage.getItem('login'));
  }
  $scope.changpass = function() {
    // Kiểm tra xem các trường thông tin bắt buộc đã được điền đầy đủ hay không
    if ($rootScope.info.email && $scope.info.password && $scope.info.newpassword && $scope.info.confirmNewPassword) {
      for (var i = 0; i < $scope.list_acc.length; i++) {
        if ($scope.list_acc[i].email === $rootScope.info.email) {
          if ($scope.list_acc[i].password === $scope.info.password) {
            if ($scope.info.newpassword === $scope.info.confirmNewPassword) {
              $rootScope.info.password = $scope.info.newpassword;
              $scope.list_acc[i] = angular.copy($rootScope.info);
              localStorage.setItem("list_account", angular.toJson($scope.list_acc));
              Swal.fire({
                title: "Đổi mật khẩu thành công!",
                icon: "success"
              });
              $rootScope.clear();
            } else {
              Swal.fire({
                title: "Lỗi!",
                text: "Xác nhận mật khẩu mới không khớp",
                icon: "error"
              });
            }
          } else {
            Swal.fire({
              title: "Lỗi!",
              text: "Mật khẩu cũ không chính xác",
              icon: "error"
            });
          }
          return;
        }
      }
    } else {
      Swal.fire({
        title: "Lỗi!",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "error"
      });
    }
  };
  $scope.logout = function() {
    // Xóa thông tin đăng nhập
    $rootScope.info = {};
    sessionStorage.removeItem('login');
    
    // Đặt lại giá trị của biến isLogin thành false
    $rootScope.isLogin = false;
  
    // Chuyển hướng đến trang đăng nhập
    window.location.href = "#!login";
  };
  // phan trang
  $scope.currentPage = 1; // Trang hiện tại
$scope.itemsPerPage = 6; // Số lượng sản phẩm hiển thị trên mỗi trang

$scope.setPage = function(pageNumber) {
  $scope.currentPage = pageNumber;
};

$scope.pageCount = function() {
  return Math.ceil($scope.products.length / $scope.itemsPerPage); // Tổng số trang
};

$scope.range = function() {
  var rangeSize = 5; // Số lượng trang hiển thị trong phân trang (ngoài trang hiện tại)

  var min = Math.max(1, $scope.currentPage - Math.floor(rangeSize / 2));
  var max = Math.min($scope.pageCount(), $scope.currentPage + Math.floor(rangeSize / 2));

  var pages = [];
  for (var i = min; i <= max; i++) {
    pages.push(i);
  }

  return pages;
};
});


