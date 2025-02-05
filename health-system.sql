drop database if exists health_system;
create database health_system;
use health_system;

-- Danxuan
create table insurance (
	id int primary key auto_increment,
    insurance_number int not null,
    expiration_date date not null
);

-- CJ
create table hospital (
	id int primary key auto_increment,
    hospital_name varchar(30) not null,
    city varchar(40) not null,
    max_capacity int not null
);

create table employee_status (
	id int primary key auto_increment,
    curr_status varchar(20) not null
);

create table physician (
	id int primary key auto_increment,
    first_name varchar(20) not null,
    last_name varchar(30) not null,
    age int not null,
    date_of_birth date not null,
    contact_number varchar(11) not null,
    email varchar(40) not null,
    status_id int not null,
    hospital_id int not null,
	constraint fk_physician_status_id
		foreign key (status_id)
		references employee_status(id),
	constraint fk_physician_hospital_id
		foreign key (hospital_id)
		references hospital(id)
);

create table nurse (
	id int primary key auto_increment,
    first_name varchar(20) not null,
    last_name varchar(30) not null,
    age int not null,
    date_of_birth date not null,
    contact_number varchar(11) not null,
    email varchar(40) not null,
    status_id int not null,
    hospital_id int not null,
	constraint fk_nurse_status_id
		foreign key (status_id)
		references employee_status(id),
	constraint fk_physician_hospital_id
		foreign key (hospital_id)
		references hospital(id)
);

create table patient (
	id int primary key auto_increment,
    first_name varchar(20) not null,
    last_name varchar(30) not null,
    age int not null,
    date_of_birth date not null,
    contact_number varchar(11) not null,
    email varchar(40) not null,
    insurance_id int not null,
    physician_id int not null,
	constraint fk_patient_insurance_id
		foreign key (insurance_id)
		references insurance(id),
	constraint fk_patient_physician_id
		foreign key (physician_id)
		references physician(id)
);

-- Nate

-- Michael
