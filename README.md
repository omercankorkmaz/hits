# HIHTS
Hastane İletişim Ve Hasta Takip Sistemi ( Hospital Communication and Patient Locating System )

# ABSTRACT

In this study, a mobile application that providing to be contacted through messages in line with the requirements of intra-hospital communication, obtaining necessary information from the hospital information system and monitoring the real-time position of the patient is proposed. Thanks to this mobile application, damages caused by communication delay or deficiency in hospitals can be prevented, environmental control can be provided by tracking the location of the patients and a higher quality service can be provided in the health sector.

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

- Bütün belirlenen bu sistemlerin gerekli işlemleri yapılabilmesi bulut tabanlı sunucu olarak için Amazon Web Services tarafından sağlanan Elastic Compute Cloud (EC2) bulut sunucuları belirlenmiştir. Ve 3 farklı EC2 Instance oluşturulmuştur. (MySql, Cassandra, Prosody için)

- Verilerin saklanacağı ortamsa yine AWS tarafından sağlanan ve EC2 ile uyumlu Elastic Block Store olarak seçilmiştir.

- Sistemde çalışanların sisteme kayıt edilmesi, sistemden silinmesi ve çalışanların şifre işlemleri gibi fonksiyonları için Admin Paneli oluşturulmuştur. Bu Web uygulaması PHP ile geliştirilmiştir.

# Notlar

Paylaşılan kodlar React Native çatısıyla oluşturulan mobil uygulamadan bazılarıdır ve kısıtlı bir şekilde paylaşılmıştır. Uygulama 13 temel ekrandan oluşmakta ve 7 farklı Action ve Reducer'dan oluşmaktadır.
