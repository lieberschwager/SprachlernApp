import javax.speech.Central;
import javax.speech.synthesis.Synthesizer;
import javax.speech.synthesis.SynthesizerModeDesc;
import java.util.Locale;

public class SprachDemo {
    public static void main(String[] args) {
        try {
            Synthesizer synthesizer = Central.createSynthesizer(
                new SynthesizerModeDesc(Locale.GERMAN)
            );
            synthesizer.allocate();
            synthesizer.resume();
            synthesizer.speakPlainText("Sag das Wort Apfel!", null);
            synthesizer.waitEngineState(Synthesizer.QUEUE_EMPTY);
            synthesizer.deallocate();
        } catch (Exception e) {
            System.out.println("Fehler bei Text-to-Speech: " + e.getMessage());
        }
    }
}
