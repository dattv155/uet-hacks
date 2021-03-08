CREATE TABLE schedule (
	masv VARCHAR(8),
	hoten VARCHAR(64),
	ngaysinh VARCHAR(64),
	lopkhoahoc VARCHAR(64),
	malmh VARCHAR(20),
	tenmonhoc VARCHAR(100),
	nhom VARCHAR(5),
	sotinchi INT,
	ghichu 	VARCHAR(20),
	PRIMARY KEY (masv, malmh)
);

CREATE TABLE class (
	mamh VARCHAR(64),
	tenmonhoc VARCHAR(64),
	tinchi int,
	malopmh VARCHAR(64),
	giangvien VARCHAR(64),
	sosv VARCHAR(64),
	buoi VARCHAR(64),
	thu VARCHAR(64),
	tiet VARCHAR(64),
	giangduong VARCHAR(64),
	ghichu VARCHAR(64),
	PRIMARY KEY (malopmh)
);