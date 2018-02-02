ALTER TABLE dogs ADD currency String DEFAULT 'XAS';
ALTER TABLE dogs ADD status String DEFAULT '1';
ALTER TABLE dogs ADD address String;

update dogs set father=4 where id=5;

insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(1,'0',8000,'admin2','DNCK8JS','https://static.oschina.net/uploads/img/201801/21081936_2LFo.png',0,1,null,null,'2018-02-01 12:22:00');
insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(2,'2',8000,'faladl','DNCK8JS','http://img4.duitang.com/uploads/item/201508/25/20150825143238_CR8tK.jpeg',0,1,null,null,'2018-02-01 12:22:00');
insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(3,'1',8000,'huido','DNCK8JS','http://img4.duitang.com/uploads/item/201508/25/20150825143238_CR8tK.jpeg',0,1,null,null,'2018-02-01 12:22:00');
insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(4,'3',8000,'wudi','DNCK8JS','https://static.oschina.net/uploads/img/201801/21081936_2LFo.png',0,1,2,3,'2018-02-01 12:22:00');
insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(5,'2',600,'james','23SSD','https://static.oschina.net/uploads/img/201801/21081936_2LFo.png',1,1,2,1,'2018-02-01 12:32:00');
insert into dogs(id,generation,amount,nickname,picode,picurl,israre,isold,father,mother,createtime)
values(6,'5',10000000,'kobes','23SFW2S','https://static.oschina.net/uploads/img/201801/21081936_2LFo.png',1,1,4,5,'2018-02-01 12:22:00');
