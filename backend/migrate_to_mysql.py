import os
import glob

# 1. Update POM.xml
pom_path = "pom.xml"
with open(pom_path, "r") as f:
    pom = f.read()

pom = pom.replace(
    "<groupId>org.postgresql</groupId>\n            <artifactId>postgresql</artifactId>",
    "<groupId>com.mysql</groupId>\n            <artifactId>mysql-connector-j</artifactId>"
)
with open(pom_path, "w") as f:
    f.write(pom)

# 2. Update Application Properties
props_shared = "src/main/resources/application.properties"
with open(props_shared, "r") as f:
    shared = f.read()
shared = shared.replace("org.hibernate.dialect.PostgreSQLDialect", "org.hibernate.dialect.MySQLDialect")
shared = shared.replace("spring.jpa.hibernate.ddl-auto=validate", "spring.jpa.hibernate.ddl-auto=update")
shared = shared.replace("spring.flyway.enabled=true", "spring.flyway.enabled=false")
with open(props_shared, "w") as f:
    f.write(shared)

props_dev = "src/main/resources/application-dev.properties"
with open(props_dev, "r") as f:
    dev = f.read()
dev = dev.replace("jdbc:postgresql://localhost:5432/interview_prep_db", "jdbc:mysql://localhost:3306/interview_prep_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC")
dev = dev.replace("org.postgresql.Driver", "com.mysql.cj.jdbc.Driver")
with open(props_dev, "w") as f:
    f.write(dev)

# 3. Update Entities to use standard Hibernate 6 JSON instead of Hypersistence
java_files = glob.glob("src/main/java/com/interviewprep/**/*.java", recursive=True)

for file in java_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    modified = False
    if "io.hypersistence" in content:
        content = content.replace("import io.hypersistence.utils.hibernate.type.array.StringArrayType;", "import org.hibernate.annotations.JdbcTypeCode;\nimport org.hibernate.type.SqlTypes;")
        content = content.replace("import io.hypersistence.utils.hibernate.type.json.JsonType;", "import org.hibernate.annotations.JdbcTypeCode;\nimport org.hibernate.type.SqlTypes;")
        content = content.replace("@Type(StringArrayType.class)", "@JdbcTypeCode(SqlTypes.JSON)")
        content = content.replace("@Type(JsonType.class)", "@JdbcTypeCode(SqlTypes.JSON)")
        
        # MySQL doesn't support text[] or jsonb column definitions natively via Hibernate easily, just use JSON
        content = content.replace('columnDefinition = "text[]"', 'columnDefinition = "json"')
        content = content.replace('columnDefinition = "jsonb"', 'columnDefinition = "json"')
        
        # Change String[] to List<String> for targetCompanies, weakAreas, badgesEarned
        content = content.replace("private String[] targetCompanies;", "private java.util.List<String> targetCompanies;")
        content = content.replace("private String[] weakAreas;", "private java.util.List<String> weakAreas;")
        content = content.replace("private String[] badgesEarned;", "private java.util.List<String> badgesEarned;")
        
        modified = True
        
    if modified:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)

print("Migration to MySQL complete.")
