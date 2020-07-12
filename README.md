# HITS
Hastane İletişim Ve Hasta Takip Sistemi ( Hospital Communication and Patient Locating System )

# ABSTRACT

In this study, we propose a mobile application as a solution which includes messaging between healthcare workers and displaying real time location of inpatients. With this mobile application, the damage caused by the delay or lack of communication in hospitals can be prevented, environmental control can be provided by tracking the location of patients and a better quality service can be provided in the healthcare sector.

# ÖZET

Bu çalışmada, hastane içi iletişimin gereksinimleri doğrultusunda mesaj ve arama yoluyla iletişim kurulabilen,
hastalara ait gerekli bilgileri hastane bilgi sisteminden elde ederek gösterebilen ve hastanın gerçek zamanlı
konumunu takip etmeyi sağlayan bir mobil uygulama önerilmektedir. Bu mobil uygulama sayesinde
hastanelerde iletişim gecikmesinin veya eksikliğinin sebep olduğu zararlar önlenebilecek, hastaların konum
takibiyle çevresel kontrol sağlanabilecek ve sağlık sektöründe daha kaliteli bir hizmet verilebilecektir.

# Kullanılan Teknolojiler

- Android ve iOS olarak iki farklı işletim sisteminde ayrı ayrı uygulama geliştirmek hem zaman kaybına hem büyük iş
yüküne sebep olacağından dolayı mobil uygulama geliştirme ortamı olarak hybrid bir geliştirme çatısı olan
React-Native seçilmiştir.

- Mobil Uygulama react-native-router-flux kütüphanesi ile birlikte Redux yapısı kullanılarak geliştirilmiştir. 

- Veri yönetimi sistemleri konusunda, hasta ve çalışan bilgilerini sorgularla devamlı olarak arayüzlerde göstermek
gerekeceğinden ilişkisel bir veritanabı yönetim sistemi olan MySQL seçilmiştir.

- Mesaj verileri konusunda hızlı ve güvenilir bir NoSQL veritabanı yönetim sistemi olan Apache Cassandra belirlenmiştir.

- Mesajlaşma protokolü (XMPP) kurmak adına ücretsiz kullanıma ve kolay bir kuruluma sahip olan Prosody sunucu
seçilmiştir.

- Donanım cihazlarından elde edilen verilerin işlenerek mobil uygulama üzerinde gösterilmesi için mqtt.js kütüphanesi ile publish-subscriber mimarisi aracılığıyla bütün receiver'lara abone olunmuştur. Ve böylelikle herhangi bir receiver bir beacon tag'inden sinyal aldığında anlık olarak mobil uygulama üzerinde tag'in sahibi olan hastanın profilinde görüntülenebilmektedir.

- Bütün belirlenen bu sistemlerin gerekli işlemleri yapılabilmesi bulut tabanlı sunucu olarak için Amazon Web Services tarafından sağlanan Elastic Compute Cloud (EC2) bulut sunucuları belirlenmiştir. Ve 3 farklı EC2 Instance oluşturulmuştur. (MySql, Cassandra, Prosody için)

- Verilerin saklanacağı ortamsa yine AWS tarafından sağlanan ve EC2 ile uyumlu Elastic Block Store olarak seçilmiştir.

- Veritabanı sunucularına bağlanma, socketio ile kanal oluşturarak broadcasting yapmak gibi server-side uygulamalar Node.js ortamında oluşturulmuştur.

- Sistemde çalışanların sisteme kayıt edilmesi, sistemden silinmesi ve çalışanların şifre işlemleri gibi fonksiyonları için Admin Paneli oluşturulmuştur. Bu Web uygulaması PHP ile geliştirilmiştir.

# Notlar

Paylaşılan kodlar Admin Paneli uygulamasından ve React Native çatısıyla oluşturulan mobil uygulamadan bazılarıdır ve kısıtlı bir şekilde paylaşılmıştır. Mobil Uygulama 13 temel ekrandan, 7 farklı Action ve Reducer'dan oluşmaktadır.
