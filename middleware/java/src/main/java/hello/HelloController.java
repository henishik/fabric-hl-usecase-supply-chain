package hello;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import java.util.concurrent.atomic.AtomicLong;

@RestController
public class HelloController {
    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();
    
    @RequestMapping("/")
    public String index() {
        return "Digital Government DLT Solutions";
    }

    @RequestMapping("/invoke-chaincode")
    public String invokeChainCode() {
        return "invoke Chaincode API";
    }

    @RequestMapping("/greeting")
    public Greeting greeting(@RequestParam(value="name", defaultValue="World") String name) {
        return new Greeting(
                counter.incrementAndGet(),
                String.format(template, name));
    }
}
