import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

type CertificatePdfProps = {
    username?: string;
    aliasName?: string;
    courseName?: string;
    dateStr?: string;
};

// Create styles
// A4 Landscape dimensions: 842pt x 595pt
const styles = StyleSheet.create({
    page: {
        position: 'relative',
        padding: 0,
        margin: 0,
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 842,
        height: 595,
    },
    nameContainer: {
        position: 'absolute',
        top: 258,
        left: 0,
        right: 0,
        width: 842,
        textAlign: 'center',
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
    },
    courseContainer: {
        position: 'absolute',
        top: 340,
        left: 0,
        right: 0,
        width: 842,
        textAlign: 'center',
    },
    courseName: {
        fontSize: 16,
        fontWeight: 'semibold',
        color: '#374151',
        textAlign: 'center',
    },
    dateContainer: {
        position: 'absolute',
        top: 410,
        left: 0,
        right: 0,
        width: 842,
        textAlign: 'center',
    },
    date: {
        fontSize: 14,
        color: '#4b5563',
        textAlign: 'center',
    },
});

// Create Document Component
const CertificatePdf = ({
    username = '',
    aliasName = '',
    courseName = '',
    dateStr = ''
}: CertificatePdfProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={{ position: 'relative', width: 842, height: 595 }}>
                <Image
                    style={styles.image}
                    src="/images/robocertificate.png"
                />
                {(username || aliasName) && (
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            {aliasName || username}
                        </Text>
                    </View>
                )}
                {courseName && (
                    <View style={styles.courseContainer}>
                        <Text style={styles.courseName}>
                            {courseName}
                        </Text>
                    </View>
                )}
                {dateStr && (
                    <View style={styles.dateContainer}>
                        <Text style={styles.date}>
                            {dateStr}
                        </Text>
                    </View>
                )}
            </View>
        </Page>
    </Document>
);

export default CertificatePdf;